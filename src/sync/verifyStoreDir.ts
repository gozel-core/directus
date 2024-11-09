import * as os from "node:os";
import { fsUtil } from "@gozel-core/standard-js-backend";
import getSlug from "speakingurl";
import { getExecName } from "../lib/getExecName";

export async function verifyStoreDir(storePathInput: string, project: string) {
    console.log(`Verifying store dir.`);

    const userSpecifiedPath = !storePathInput.includes("[user-home]");

    if (userSpecifiedPath) {
        await fsUtil.verifyDir(storePathInput, true);

        console.log(`Store dir has been set: ${userSpecifiedPath}`);

        return storePathInput;
    } else {
        const userHome = os.homedir();
        const execName = getExecName();
        const projectSlug = getSlug(project);
        const final = `${userHome}/${execName}/${projectSlug}`;
        await fsUtil.verifyDir(final, true);

        console.log(`Store dir has been set: ${final}`);

        return final;
    }
}
