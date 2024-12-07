import type { DirectusField } from "@directus/sdk";

export function getRecipe(): NestedPartial<DirectusField> {
    return {
        field: "translations",
        type: "alias",
        // @ts-ignore
        schema: null,
        meta: {
            special: ["translations"],
            interface: "translations",
            options: {
                languageField: "code",
                userLanguage: true,
            },
            display: "translations",
            display_options: {
                template: "{{title}}",
                languageField: "code",
                userLanguage: true,
            },
            readonly: false,
            hidden: false,
            width: "full",
            translations: null,
            note: null,
            conditions: null,
            required: false,
            group: null,
            validation: null,
            validation_message: null,
        },
    };
}
