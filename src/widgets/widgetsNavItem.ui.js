/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import * as Widgets from "./widgets";
import {connect} from "react-redux";
import * as WidgetConfig from './widgetConfig'
import * as _ from 'lodash'
import * as ui from "../ui/elements.ui";
import * as WidgetPlugins from './widgetPlugins'
import {reset} from "redux-form";
import {PropTypes as Prop}  from "react";


const WidgetsNavItem = (props) => {

    return <div className="ui simple dropdown item">
        Add Widget
        <i className="dropdown icon"/>
        <div className="ui menu">

            <ui.Divider/>
            {
                _.valuesIn(props.widgetPlugins).map(widgetPlugin => {
                    return <AddWidget key={widgetPlugin.id}
                                      text={widgetPlugin.typeInfo.name}
                                      type={widgetPlugin.typeInfo.type}/>;
                })
            }
        </div>
    </div>;
};

WidgetsNavItem.propTypes = {
    widgetPlugins: Prop.objectOf(
        WidgetPlugins.widgetPluginType
    )
};

export default connect(
    (state) => {
        return {
            widgetPlugins: state.widgetPlugins
        }
    }
)(WidgetsNavItem);

const AddWidget = connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            onClick: (props) => {
                dispatch(WidgetConfig.createWidget(props.type))
            }
        }
    }
)(ui.LinkItem);