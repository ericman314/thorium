import React from "react";
import { FormGroup, Label, Input } from "reactstrap";
import { Query } from "react-apollo";
import gql from "graphql-tag";

export default ({ updateArgs, args, client }) => {
  return (
    <FormGroup className="macro-addCommandLine">
      <Label>Command Line</Label>
      <Input
        type="select"
        value={args.commandLine}
        onChange={e => updateArgs("commandLine", e.target.value)}
      >
        <option value="nothing">Select a command line.</option>
        <Query
          query={gql`
            query CommandLines {
              commandLine {
                id
                name
                commands {
                  name
                }
              }
            }
          `}
        >
          {({ loading, data: { commandLine } }) =>
            loading
              ? null
              : commandLine.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
          }
        </Query>
      </Input>
    </FormGroup>
  );
};
