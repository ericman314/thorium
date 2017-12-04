import React, { Component } from "react";
import { Label, Input, FormGroup } from "reactstrap";
import gql from "graphql-tag";

export default class GenericConfig extends Component {
  constructor(props) {
    super(props);
    this.state = { message: props.args.message };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.args.message !== this.state.message) {
      this.setState({ message: nextProps.args.message });
    }
  }
  update = evt => {
    const { systemId, id, client } = this.props;
    const mutation = gql`
      mutation UpdateDamageStep($systemId: ID!, $step: DamageStepInput!) {
        updateSystemDamageStep(systemId: $systemId, step: $step)
      }
    `;
    const variables = {
      systemId,
      step: {
        id,
        args: {
          message: evt.target.value
        }
      }
    };
    client.mutate({ mutation, variables });
  };
  updateEnd = evt => {
    const { systemId, id, client } = this.props;
    const mutation = gql`
      mutation UpdateDamageStep($systemId: ID!, $step: DamageStepInput!) {
        updateSystemDamageStep(systemId: $systemId, step: $step)
      }
    `;
    const variables = {
      systemId,
      step: {
        id,
        args: {
          end: evt.target.checked
        }
      }
    };
    client.mutate({
      mutation,
      variables,
      refetchQueries: ["Simulators"]
    });
  };
  render() {
    return (
      <div>
        <div>Generic Config</div>
        <small>
          You can use some hashtags to make your report dynamic:
          <ul>
            <li>
              <strong>#COLOR</strong> - a random color of red, green, blue,
              yellow
            </li>
            <li>
              <strong>#PART</strong> - a random exocomp part
            </li>
            <li>
              <strong>#[1 - 2]</strong> - a random whole number between the two
              listed numbers
            </li>
            <li>
              <strong>#["string1", "string2", "string3", etc.]</strong> - a
              random string from the list provided
            </li>
          </ul>
        </small>
        <FormGroup check>
          <Label check>
            Put at end of report?{" "}
            <Input
              type="checkbox"
              checked={this.props.args.end}
              onChange={this.updateEnd}
            />
          </Label>
        </FormGroup>
        <Label>Message</Label>
        <Input
          type="textarea"
          value={this.state.message || ""}
          onChange={evt => this.setState({ message: evt.target.value })}
          onBlur={this.update}
        />
      </div>
    );
  }
}