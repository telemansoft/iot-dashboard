/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import WidgetPlugin from './widgetPlugin'
import PluginRegistry from '../pluginApi/pluginRegistry'
import * as Action from "../actionNames";
import {genCrudReducer} from "../util/reducer";
import {PropTypes as Prop}  from "react";


// TODO: Later load all plugins from external URL's ?
const initialState = {};

export const widgetPluginType = Prop.shape({
    id: Prop.string.isRequired,
    typeInfo: Prop.shape({
        type: Prop.string.isRequired,
        name: Prop.string.isRequired,
        settings: Prop.array
    })
});


class WidgetPluginRegistry extends PluginRegistry {

    createPluginFromModule(module) {
        return new WidgetPlugin(module, this.store);
    }
}


export const pluginRegistry = new WidgetPluginRegistry();

export function unloadPlugin(type) {
    return function(dispatch) {
        const widgetPlugin = pluginRegistry.getPlugin(type);
        widgetPlugin.dispose();
        dispatch(deletePlugin(type));
    }
}

function deletePlugin(type) {
    return {
        type: Action.DELETE_WIDGET_PLUGIN,
        id: type
    }
}

const pluginsCrudReducer = genCrudReducer([Action.ADD_WIDGET_PLUGIN, Action.DELETE_WIDGET_PLUGIN], widgetPlugin);
export function widgetPlugins(state = initialState, action) {

    state = pluginsCrudReducer(state, action);
    switch (action.type) {
        default:
            return state;
    }

}

function widgetPlugin(state, action) {
    switch (action.type) {
        case Action.ADD_WIDGET_PLUGIN:
            if (!action.typeInfo.type) {
                // TODO: Catch this earlier
                throw new Error("A Plugin needs a type name.");
            }

            return {
                id: action.typeInfo.type,
                url: action.url,
                typeInfo: action.typeInfo
            };
        default:
            return state;
    }
}
