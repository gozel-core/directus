import {
    createPermission,
    createPolicy,
    type DirectusPermission,
    readMe,
    readPermissions,
    readPolicies,
    readRole,
    readUser,
    updateRole,
} from "@directus/sdk";
import { collections } from "./domains/index";
import { wait } from "../lib/util";

export async function createAccessPolicy(
    client: RefDirectusClient,
    namespace: string,
    owner?: string,
) {
    console.log(`Configuring access policy...`);
    const policyName = prettyNamespace(namespace);
    const allPolicies = await client.request(readPolicies());
    const doesPolicyExists = allPolicies.some((p) => p.name === policyName);
    const policy = doesPolicyExists
        ? allPolicies.find((p) => p.name === policyName)!
        : await client.request(
              createPolicy({
                  name: policyName,
                  icon: "badge",
                  description: null,
                  ip_access: null,
                  admin_access: false,
                  app_access: true,
                  permissions: [],
                  users: [],
                  roles: [],
              }),
          );
    console.log(`The policy (${policyName}) verified.`);

    const existingPermissions = await client.request(
        readPermissions({
            filter: {
                policy: {
                    _eq: policy.id,
                },
            },
        }),
    );
    const permissionsToAdd: NestedPartial<DirectusPermission>[] = [];
    const collectionNames = Object.keys(collections)
        .map((k) =>
            collections[k as keyof typeof collections].getCollectionNames(
                namespace,
            ),
        )
        .reduce(
            (arr, memo) => memo.concat(arr),
            ["businesses", "deploy_settings", "geo_regions", "timezones"],
        );
    collectionNames.map((name) => {
        if (existingPermissions.some((ep) => ep.collection === name)) return;
        createPermissionObjects(policy.id, name).map((p) =>
            permissionsToAdd.push(p),
        );
    });
    if (permissionsToAdd.length > 0) {
        for (const perm of permissionsToAdd) {
            await client.request(createPermission(perm));
            await wait(300);
        }
    }
    console.log(`Verified permissions.`);

    if (owner) {
        const ownerUser = await client.request(readUser(owner));
        if (ownerUser.role) {
            const ownerRole = await client.request(
                readRole(ownerUser.role as string),
            );
            if (!(ownerRole.policies as string[]).includes(policy.id)) {
                try {
                    await client.request(
                        updateRole(ownerRole.id, {
                            policies: (
                                (ownerRole.policies as string[]) || []
                            ).concat([policy.id]),
                        }),
                    );
                } catch (e) {
                    console.log("e:", e);
                }

                console.log(`The policy added to user role.`);
            }
        } else {
            console.warn(
                `Owner doesn't have a role. Create a role for the owner and re-run this command.`,
            );
        }
    }

    console.log(`Configuring access policy... Done.`);

    function createPermissionObjects(
        policyId: string,
        collectionName: string,
    ): NestedPartial<DirectusPermission>[] {
        if (
            collectionName === "timezones" ||
            collectionName === "geo_regions"
        ) {
            return [
                {
                    policy: policyId,
                    collection: collectionName,
                    action: "read",
                    permissions: null,
                    fields: ["*"],
                },
            ];
        } else {
            return ["create", "read", "update", "delete", "share"].map(
                (action) => ({
                    policy: policyId,
                    collection: collectionName,
                    action,
                    permissions:
                        action === "create"
                            ? null
                            : {
                                  _and: [
                                      {
                                          user_created: {
                                              role: {
                                                  _in: ["$CURRENT_ROLES"],
                                              },
                                          },
                                      },
                                  ],
                              },
                    fields: ["*"],
                }),
            );
        }
    }

    function prettyNamespace(str: string) {
        return str
            .split("_")
            .map((s) => s.slice(0, 1).toUpperCase() + s.slice(1))
            .join(" ");
    }
}
