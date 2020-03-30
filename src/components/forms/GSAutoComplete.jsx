import React from "react";
import AutoComplete from "material-ui/AutoComplete";
import { dataSourceItem } from "../../components/utils";

import GSFormField from "./GSFormField";

export default class GSAutoComplete extends GSFormField {
  constructor(props) {
    super(props);
    this.state = {
      selectData: this.createMenuItems(props),
      value: props.value
    };
  }

  createMenuItems = props =>
    props.choices.map(({ value, label }) => dataSourceItem(label, value));

  findMatchingChoices = valueToLookFor => {
    const regex = new RegExp(`.*${valueToLookFor}.*`, "i");
    return this.state.selectData.filter(item => regex.test(item.text));
  };

  render = () => {
    return (
      <AutoComplete
        autoFocus
        onUpdateInput={searchText => {
          this.setState({ name: searchText });
          const matches = this.findMatchingChoices(searchText);
          if (!matches.length || !searchText.trim().length) {
            this.props.onChange(undefined);
          }
        }}
        searchText={this.state.value.label}
        filter={AutoComplete.caseInsensitiveFilter}
        hintText={this.props.hintText}
        dataSource={this.state.selectData}
        onNewRequest={value => {
          // If you're searching but get no match, value is a string
          // representing your search term, but we only want to handle matches
          if (typeof value === "object") {
            const data = value.rawValue;
            this.setState({ data, name: value.text });
            this.props.onChange(
              JSON.stringify({
                data,
                name: value.text
              })
            );
          } else {
            // if it matches one item, that's their selection
            const matches = this.findMatchingChoices(value);
            if (matches.length === 1) {
              const data = matches[0].rawValue;
              const searchText = matches[0].text;
              this.setState({ name: searchText, data });
              this.props.onChange({
                data,
                name: searchText
              });
            } else {
              this.setState({ data: undefined });
              this.props.onChange(undefined);
            }
          }
        }}
      />
    );
  };
}
