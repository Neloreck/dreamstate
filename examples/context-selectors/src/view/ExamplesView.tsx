import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { withConsumption } from "dreamstate";

// View.
import { getFullCurrentTime } from "./utils/time";
import { PropsDisplay } from "./PropsDisplay";
import { AuthContextManager, DataContextManager } from "../data";

const Example1 = withConsumption(
  {
    from: DataContextManager,
    take: "dataState"
  },
)(PropsDisplay);

const Example2 = withConsumption(
  {
    from: AuthContextManager,
    take: "user",
    as: "aliasedUserProp"
  },
)(PropsDisplay);

const Example3 = withConsumption(
  {
    from: DataContextManager,
    take: ({ dataState: { value } }) => ({ value }),
  },
)(PropsDisplay);

const Example4 = withConsumption(
  {
    from: AuthContextManager,
    take: ({ user, score }) => ({ isUserLoading: user.isLoading, scoresGot: score }),
    as: "selectedAuthProps"
  },
)(PropsDisplay);

const Example5 = withConsumption(
  {
    from: AuthContextManager,
    take: [ "authActions", "score" ]
  },
)(PropsDisplay);

const Example6 = withConsumption(
  {
    from: DataContextManager,
    take: [ "dataState" ],
    as: "aliasedObject"
  },
)(PropsDisplay);

const Example7 = withConsumption(
  {
    from: DataContextManager,
    as: "justAlias"
  },
)(PropsDisplay);

const Example8 = withConsumption(
  {
    from: AuthContextManager,
  },
)(PropsDisplay);

const Example9 = withConsumption(
  {
    from: DataContextManager,
    take: [],
  },
)(PropsDisplay);

export class ExamplesView extends PureComponent {

  public render(): ReactNode {

    return (
      <div className={"example-view"}>

        Rendered: { getFullCurrentTime() }

        <h3> String selectors: </h3>

        <Example1 description={"Only dataState."}/>

        <Example2 description={"Only user as aliased prop."}/>

        <h3> Functional selectors: </h3>

        <Example3 description={"Only value, selected from nested object."}/>

        <Example4 description={"Aliased auth context props selected from context."}/>

        <h3> Array selectors: </h3>

        <Example5 description={"Get auth actions and scores with array."}/>

        <Example6 description={"Get data state and alias it."}/>

        <h3> Edge cases: </h3>

        <Example7 description={"Only alias for context."}/>

        <Example8 description={"Take everything, no selector/alias provided."}/>

        <Example9 description={"Get nothing, empty array provided."}/>

      </div>
    );
  }

}
