/*
 * Copyright 2017 HugeGraph Authors
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. The ASF
 * licenses this file to You under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';

export default class ErrorResult extends React.Component {

    constructor() {
        super();
        this.state = {
            showDetail: false
        }
    }

    render() {
        let display = this.state.showDetail ? 'block' : 'none';
        let errorPanel =
            <div className="alert alert-danger err_msg">
                <h5>{this.props.msg.title}</h5>
            </div>;
        let detailedMsg = this.props.msg.detailedMsg;
        let title_message = '';
        if (detailedMsg.message !== null) {
            let innerMessage = '';
            try {
                innerMessage = JSON.parse(detailedMsg.message).message;
            } catch (err) {
                innerMessage = detailedMsg.message;
            }

            title_message = innerMessage;
        } else {
            title_message = detailedMsg.message;
        }

        if (detailedMsg !== undefined) {
            errorPanel =
                <div className="alert alert-danger err_msg">
                    <h5>{this.props.msg.title}</h5>
                    <div className="err_title">
                        {title_message}
                        <span className="label label-danger detail"
                              onClick={this.showDetail}>
                            Detail
                        </span>
                    </div>
                    <div id={this.props.cellId + '_error'}
                         className="detailed_err_msg"
                         style={{display: display}}>
                    </div>
                </div>;
        }

        return (
            <div>
                {errorPanel}
            </div>
        );
    }

    showDetail = () => {
        this.setState({
            showDetail: !this.state.showDetail
        });
    }

    componentDidUpdate() {
        let detailedMsg = this.props.msg.detailedMsg;
        let cellId = this.props.cellId;
        if (detailedMsg !== undefined) {
            let paneJson = '#' + cellId + '_error';
            let json = this.formatMessage(detailedMsg);
            $(paneJson).JSONView(json, {collapsed: false});
        }
        this.loadDone();
    }

    componentDidMount() {
        let detailedMsg = this.props.msg.detailedMsg;
        let cellId = this.props.cellId;
        if (detailedMsg !== undefined) {
            let paneJson = '#' + cellId + '_error';
            let json = this.formatMessage(detailedMsg);
            $(paneJson).JSONView(json, {collapsed: false});
        }
        this.loadDone();
    }

    loadDone = () => {
        let loadingId = this.props.cellId + '_loading';
        document.getElementById(loadingId).style.display = 'none';
    }

    // Replace \n\t with blank
    formatMessage = (detailedMsg) => {
        let message = '';
        if (detailedMsg.message !== null) {
            message = detailedMsg.message;
        }

        if (message !== null || message !== undefined || message !== '') {
            message = message.replace(/\\n\\t/g, "==>");
        }

        try {
            JSON.parse(message);
        } catch (err) {
            message = {'message': message};
        }
        return message;
    }
}
