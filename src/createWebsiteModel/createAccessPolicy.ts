import {
    createPermission,
    createPolicy,
    deletePermissions,
    deletePolicies,
    readPermissions,
} from "@directus/sdk";
import { collections } from "./domains/index";

export async function createAccessPolicy(
    client: RefDirectusClient,
    namespace: string,
) {
    const collectionNames = Object.keys(collections)
        .map((k) =>
            collections[k as keyof typeof collections].getCollectionNames(
                namespace,
            ),
        )
        .reduce((arr, memo) => memo.concat(arr), []);
    const label = prettyNamespace(namespace);

    console.log(`Configuring access policy (${label})...`);

    const existingPermissions = await client.request(readPermissions());
    const has = existingPermissions.some((perm) =>
        collectionNames.includes(perm.collection),
    );

    if (has) {
        console.log(
            `Configuring access policy (${label}): removing existing permissions and access policy first.`,
        );

        const permsToRemove = existingPermissions.filter((perm) =>
            collectionNames.includes(perm.collection),
        );
        const policiesToRemove = permsToRemove
            .map((perm) => perm.policy as string)
            .filter((perm, i, self) => self.indexOf(perm) === i);

        try {
            await client.request(
                deletePermissions(permsToRemove.map(({ id }) => id)),
            );
        } catch (e) {}

        try {
            await client.request(deletePolicies(policiesToRemove));
        } catch (e) {}
    }

    const policy = await client.request(
        createPolicy({
            name: label,
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

    const permissions = collectionNames.reduce(
        (memo: string[][], collection) => {
            memo = memo.concat([
                [collection, "create"],
                [collection, "read"],
                [collection, "update"],
                [collection, "delete"],
                [collection, "share"],
            ]);
            return memo;
        },
        [],
    );

    for (const permission of permissions) {
        const _action = permission[1]!;
        const _rules =
            _action === "create"
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
                  };
        await client.request(
            createPermission({
                policy: policy.id,
                collection: permission[0]!,
                action: _action,
                permissions: _rules,
                validation: null,
                fields: ["*"],
            }),
        );
    }

    console.log(`Configuring access policy (${label})... Done.`);

    function prettyNamespace(str: string) {
        return str
            .split("_")
            .map((s) => s.slice(0, 1).toUpperCase() + s.slice(1))
            .join(" ");
    }
}
