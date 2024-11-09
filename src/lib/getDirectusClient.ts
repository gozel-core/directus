import { createDirectus, rest, staticToken } from "@directus/sdk";

export async function getDirectusClient() {
    return createDirectus<RefSchema>(process.env.DIRECTUS_URL)
        .with(staticToken(process.env.DIRECTUS_TOKEN))
        .with(rest());
}
