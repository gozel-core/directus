export function getFieldRecipe(
    name: string,
    { collection }: { collection: string },
) {
    if (name === "userCreated") {
        return {
            field: "user_created",
            type: "uuid",
            meta: {
                field: "user_created",
                special: ["user-created"],
                interface: "select-dropdown-m2o",
                options: {
                    template:
                        "{{avatar.$thumbnail}} {{first_name}} {{last_name}}",
                },
                display: "user",
                display_options: null,
                readonly: true,
                hidden: true,
                width: "half",
                translations: null,
                note: null,
                conditions: null,
                required: false,
                group: null,
                validation: null,
                validation_message: null,
            },
            schema: {
                data_type: "uuid",
                default_value: null,
                generation_expression: null,
                max_length: null,
                numeric_precision: null,
                numeric_scale: null,
                is_generated: false,
                is_nullable: true,
                is_unique: false,
                is_indexed: false,
                is_primary_key: false,
                has_auto_increment: false,
                foreign_key_schema: "public",
                foreign_key_table: "directus_users",
                foreign_key_column: "id",
                comment: null,
            },
        };
    }

    if (name === "dateCreated") {
        return {
            field: "date_created",
            type: "timestamp",
            meta: {
                field: "date_created",
                special: ["date-created"],
                interface: "datetime",
                options: null,
                display: "datetime",
                display_options: {
                    relative: true,
                },
                readonly: true,
                hidden: true,
                width: "half",
                translations: null,
                note: null,
                conditions: null,
                required: false,
                group: null,
                validation: null,
                validation_message: null,
            },
            schema: {
                data_type: "timestamp with time zone",
                default_value: null,
                generation_expression: null,
                max_length: null,
                numeric_precision: null,
                numeric_scale: null,
                is_generated: false,
                is_nullable: true,
                is_unique: false,
                is_indexed: false,
                is_primary_key: false,
                has_auto_increment: false,
                foreign_key_schema: null,
                foreign_key_table: null,
                foreign_key_column: null,
                comment: null,
            },
        };
    }

    if (name === "userUpdated") {
        return {
            field: "user_updated",
            type: "uuid",
            meta: {
                field: "user_updated",
                special: ["user-updated"],
                interface: "select-dropdown-m2o",
                options: {
                    template:
                        "{{avatar.$thumbnail}} {{first_name}} {{last_name}}",
                },
                display: "user",
                display_options: null,
                readonly: true,
                hidden: true,
                width: "half",
                translations: null,
                note: null,
                conditions: null,
                required: false,
                group: null,
                validation: null,
                validation_message: null,
            },
            schema: {
                data_type: "uuid",
                default_value: null,
                generation_expression: null,
                max_length: null,
                numeric_precision: null,
                numeric_scale: null,
                is_generated: false,
                is_nullable: true,
                is_unique: false,
                is_indexed: false,
                is_primary_key: false,
                has_auto_increment: false,
                foreign_key_schema: "public",
                foreign_key_table: "directus_users",
                foreign_key_column: "id",
                comment: null,
            },
        };
    }

    if (name === "dateUpdated") {
        return {
            field: "date_updated",
            type: "timestamp",
            meta: {
                field: "date_updated",
                special: ["date-updated"],
                interface: "datetime",
                options: null,
                display: "datetime",
                display_options: {
                    relative: true,
                },
                readonly: true,
                hidden: true,
                sort: 5,
                width: "half",
                translations: null,
                note: null,
                conditions: null,
                required: false,
                group: null,
                validation: null,
                validation_message: null,
            },
            schema: {
                data_type: "timestamp with time zone",
                default_value: null,
                generation_expression: null,
                max_length: null,
                numeric_precision: null,
                numeric_scale: null,
                is_generated: false,
                is_nullable: true,
                is_unique: false,
                is_indexed: false,
                is_primary_key: false,
                has_auto_increment: false,
                foreign_key_schema: null,
                foreign_key_table: null,
                foreign_key_column: null,
                comment: null,
            },
        };
    }

    if (name === "status") {
        return {
            field: "status",
            type: "string",
            schema: {
                name: "status",
                //"table": collection,
                data_type: "character varying",
                default_value: "draft",
                generation_expression: null,
                max_length: 255,
                numeric_precision: null,
                numeric_scale: null,
                is_generated: false,
                is_nullable: false,
                is_unique: false,
                is_indexed: false,
                is_primary_key: false,
                has_auto_increment: false,
                foreign_key_schema: null,
                foreign_key_table: null,
                foreign_key_column: null,
                comment: null,
            },
            meta: {
                //"collection": collection,
                field: "status",
                special: null,
                interface: "select-dropdown",
                options: {
                    choices: [
                        {
                            text: "$t:published",
                            value: "published",
                            color: "#2ECDA7",
                        },
                        {
                            text: "$t:draft",
                            value: "draft",
                            color: "#FFC23B",
                        },
                        {
                            text: "$t:archived",
                            value: "archived",
                            color: "#A2B5CD",
                        },
                    ],
                },
                display: "labels",
                display_options: {
                    showAsDot: true,
                    choices: [
                        {
                            text: "$t:published",
                            value: "published",
                            color: "#2ECDA7",
                            foreground: "var(--theme--primary)",
                            background: "var(--theme--primary-background)",
                        },
                        {
                            text: "$t:draft",
                            value: "draft",
                            color: "#FFC23B",
                            foreground: "var(--theme--foreground)",
                            background: "var(--theme--background-normal)",
                        },
                        {
                            text: "$t:archived",
                            value: "archived",
                            color: "#A2B5CD",
                            foreground: "var(--theme--warning)",
                            background: "var(--theme--warning-background)",
                        },
                    ],
                },
                readonly: false,
                hidden: false,
                sort: 2,
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

    if (name === "sort") {
        return {
            //collection,
            field: "sort",
            type: "integer",
            meta: {
                field: "sort",
                special: null,
                interface: "input",
                options: null,
                display: null,
                display_options: null,
                readonly: false,
                hidden: true,
                width: "full",
                translations: null,
                note: null,
                conditions: null,
                required: false,
                group: null,
                validation: null,
                validation_message: null,
            },
            schema: {
                data_type: "integer",
                default_value: null,
                numeric_precision: 32,
                numeric_scale: 0,
                is_generated: false,
                is_nullable: true,
            },
        };
    }

    return;
}
