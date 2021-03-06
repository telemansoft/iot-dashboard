/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Action from "../actionNames";
import * as DatasourcePlugins from "../datasource/datasourcePlugins";
import * as WidgetPlugins from "../widgets/widgetPlugins";
import loadjs from "loadjs";
import * as PluginCache from "./pluginCache";
import * as _ from "lodash";
import URI from "urijs";

export function loadPlugin(plugin) {
    return addPlugin(plugin);
}


export function loadPluginFromUrl(url) {
    return function (dispatch) {
        loadjs([url], {success: () => onScriptLoaded(url, dispatch)});
    };
}

function onScriptLoaded(url, dispatch) {
    if (PluginCache.hasPlugin()) {
        const plugin = PluginCache.popLoadedPlugin();

        const dependencies = plugin.TYPE_INFO.dependencies;
        if (_.isArray(dependencies) && dependencies.length !== 0) {

            const paths = dependencies.map(dependency => {
                return URI(dependency).absoluteTo(url).toString();
            });

            console.log("Loading Dependencies for Plugin", paths);

            // TODO: Load Plugins into a sandbox / iframe, and pass as "deps" object
            // Let's wait for the dependency hell before introducing this.
            // Until then we can try to just provide shared libs by the Dashboard, e.g. jQuery, d3, etc.
            // That should avoid that people add too many custom libs.
            /*sandie([dependencies],
             function (deps) {
             plugin.deps = deps;
             console.log("deps loaded", deps);
             dispatch(addPlugin(plugin, url));
             }
             );  */


            loadjs(paths, {
                success: () => {
                    dispatch(addPlugin(plugin, url));
                }
            });
        }
        else {
            dispatch(addPlugin(plugin, url));
        }
    }
    else {
        console.error("Failed to load Plugin. Make sure it called window.iotDashboardApi.register***Plugin from url " + url);
    }
}


export function initializeExternalPlugins() {
    return (dispatch, getState) => {
        const state = getState();
        const plugins = _.valuesIn(state.plugins);

        plugins.filter(pluginState => !_.isEmpty(pluginState.url)).forEach(plugin => {
            dispatch(loadPluginFromUrl(plugin.url));
        })
    }
}

function registerPlugin(plugin) {
    const type = plugin.TYPE_INFO.type;
    if (plugin.Datasource) {
        const dsPlugin = DatasourcePlugins.pluginRegistry.getPlugin(type);
        if (!dsPlugin) {
            DatasourcePlugins.pluginRegistry.register(plugin);
        }
        else {
            console.warn("Plugin of type " + type + " already loaded:", dsPlugin, ". Tried to load: ", plugin);
        }
    }
    else if (plugin.Widget) {
        const widgetPlugin = WidgetPlugins.pluginRegistry.getPlugin(type);
        if (!widgetPlugin) {
            WidgetPlugins.pluginRegistry.register(plugin);
        }
        else {
            console.warn("Plugin of type " + type + " already loaded:", widgetPlugin, ". Tried to load: ", plugin);
        }
    }
    else {
        throw new Error("Plugin neither defines a Datasource nor a Widget.", plugin);
    }
}

// Add plugin to store and register it in the PluginRegistry
export function addPlugin(plugin, url = null) {
    console.log("Adding plugin from " + url, plugin);

    return function (dispatch, getState) {
        const state = getState();
        const plugins = state.plugins;

        const existentPluginState = _.valuesIn(plugins).find(pluginState => {
            return plugin.TYPE_INFO.type === pluginState.pluginType;
        });

        if (existentPluginState) {
            registerPlugin(plugin);
            return;
        }

        let actionType = "unknown-add-widget-action";
        if (plugin.Datasource !== undefined) {
            actionType = Action.ADD_DATASOURCE_PLUGIN;
        }
        if (plugin.Widget !== undefined) {
            actionType = Action.ADD_WIDGET_PLUGIN;
        }

        // TODO: Just put the raw plugin + url here and let the reducer do the logic
        dispatch({
            type: actionType,
            id: plugin.TYPE_INFO.type, // needed for crud reducer
            typeInfo: plugin.TYPE_INFO,
            url
        });
        // TODO: Maybe use redux sideeffect and move this call to the reducer
        registerPlugin(plugin);
    }
}
