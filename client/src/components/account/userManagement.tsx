import { useCallback, useEffect, useState } from "react";
import { useGlobalUserStore } from "../../stores/globalUserStore";

const ChangeUsername: React.FC = () => {
    const updateDisplayname = useGlobalUserStore(
      useCallback((state) => state.updateDisplayname, []),
    );
    const [localDisplayname, setLocalDisplayname] = useState<string>("");
    const [success, setSuccess] = useState<{ success: boolean; error?: Error }>();
    useEffect(() => {
      setTimeout(() => setSuccess(undefined), 1500);
    }, [success]);
    const changeName = useCallback(
      (newName: string) => {
        updateDisplayname(newName, (s, e) =>
          setSuccess({ success: s, error: e }),
        );
      },
      [updateDisplayname],
    );
    return (
      <div className="stack:s-2 align-start">
        <input
          type="text"
          className="padded:s-1 "
          placeholder="new username"
          value={localDisplayname}
          onChange={(e) => setLocalDisplayname(e.target.value)}
        />
        <div
          className="clickable padded:s-2 border-thin whiteFill greenFill:hover"
          onClick={() => changeName(localDisplayname)}
        >
          change username
        </div>
        {success &&
          (success.success == true ? (
            <div className="green">succesfully changed display name!</div>
          ) : (
            <div className="red"> hmm.. something went wrong</div>
          ))}
      </div>
    );
  };
  
  const SignOut = () => {
    const signOut = useGlobalUserStore(useCallback((state) => state.signOut, []));
  
    return (
      <div
        className="clickable border-thin padded:s-2 whiteFill greenFill:hover"
        onClick={() => signOut()}
      >
        sign out
      </div>
    );
  };

  export {ChangeUsername, SignOut};