import {
  ChangeEvent,
  CSSProperties,
  default as React,
  ReactElement,
  useCallback,
  useState
} from "react";
import { useManager } from "dreamstate";
import { SampleContextManager } from "../stores/SampleContextManager";
import { useRendersCount } from "../hooks/useRendersCount";

const editorStyle: CSSProperties = {
  padding: "4px",
  margin: "4px",
  border: "1px solid black"
}

export function SampleContextEditor(): ReactElement {
  /**
   * Second parameter here is 'selector' that is called on each SampleContext update.
   * Returning dependencies comparison will tell whether current component should update.
   *
   * Current component receives only constant actions reference and it does not need to update on every
   * sampleNumber or sampleString change. So in this case we should get actions reference
   * and block next updates with '[]' return value.
   */
  const { sampleString, sampleActions } = useManager(SampleContextManager, () => []);
  const [ localSampleString, setLocalSampleString ] = useState(sampleString);
  const rendersCount: number = useRendersCount();

  const onLocalSampleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setLocalSampleString(event.target.value);
  }, []);

  const onCommitChanges = useCallback(
    () => sampleActions.setSampleString(localSampleString),
    [ localSampleString, sampleActions ]
  );

  return (
    <div style={editorStyle}>
      <div>
        Editor renders count: { rendersCount }
      </div>

      <div>
        <button onClick={sampleActions.incrementSampleNumber}> Increment sample number </button>
      </div>

      <div>
        <button onClick={onCommitChanges}> Commit local text changes </button>
        <input value={localSampleString} onChange={onLocalSampleChange}/>
      </div>
    </div>
  )
}
