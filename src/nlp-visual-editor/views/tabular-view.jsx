/*

Copyright 2022 Elyra Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from 'react';
import { connect } from 'react-redux';
import { Information } from '@carbon/icons-react';

import './tabular-view.scss';

import { Tabs, TabList, Tab, TabPanels, TabPanel, TabsSkeleton } from '@carbon/react';
import TableResults from './components/table-results';
import { setDocumentViewToAnnotation } from '../../redux/slice';

class TabularView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }

  getInputDocumentName = () => {
    const { nodes } = this.props;
    const node = nodes.find((n) => n.type === 'input') || {};
    const { name } = node.files[0];
    return name;
  };

  getTable = (name) => {
    const { tabularResults, onRowSelected } = this.props;
    const { annotations } = tabularResults;
    const docName = this.getInputDocumentName();
    const data = annotations[name];
    if (data.length === 0) {
      return (
        <div className="no-matches">
          <Information size={24} aria-label="Information" className="info-icon" />
          <span>No matches found.</span>
        </div>
      );
    }
    return (
      <TableResults
        tabularData={data}
        label={name}
        docName={docName}
        onRowSelected={onRowSelected}
      />
    );
  };

  getTabs = () => {
    const { tabularResults, nodes } = this.props;
    const hasFile = nodes.find((n) => n.type === 'input');
    if (hasFile && hasFile.files.length === 0) {
      //user removed the selected file to scan a different file, no tabular results to render
      return null;
    }
    if (!tabularResults) {
      return <TabsSkeleton />;
    }
    const { names } = tabularResults;
    const tabs = [];
    const tabPanels = [];
    names.forEach((name, index) => {
      const table = this.getTable(name);
      const tabId = `${name.toLowerCase()}_id`;
      tabs.push(
        <Tab
          key={tabId}
          onClick={() => {
            this.setState({ selectedIndex: index });
            this.props.setDocumentAnnotation(name);
          }}
        >
          {name}
        </Tab>,
      );
      tabPanels.push(
        <TabPanel key={`${tabId}_panel`}>
          {table}
        </TabPanel>,
      );
    });
    return (
      <Tabs
        selectedIndex={this.state.selectedIndex}
        onChange={({ selectedIndex }) => {
          this.setState({ selectedIndex });
          if (names[selectedIndex]) {
            this.props.setDocumentAnnotation(names[selectedIndex]);
          }
        }}
      >
        <TabList aria-label="Tabular results">
          {tabs}
        </TabList>
        <TabPanels>
          {tabPanels}
        </TabPanels>
      </Tabs>
    );
  };

  render() {
    const tabs = this.getTabs();
    return <div className="tabular-view">{tabs}</div>;
  }
}

const mapStateToProps = (state) => ({
  nodes: state.nodesReducer.nodes,
  tabularResults: state.nodesReducer.tabularResults,
});

const mapDispatchToProps = (dispatch) => ({
  setDocumentAnnotation: (annotation) =>
    dispatch(setDocumentViewToAnnotation(annotation)),
});
export default connect(mapStateToProps, mapDispatchToProps)(TabularView);