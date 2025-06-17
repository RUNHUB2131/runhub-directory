create table "public"."webflow_import" (
    "Run Club Name" text,
    "Slug" text,
    "Collection ID" text,
    "Locale ID" text,
    "Item ID" text,
    "Archived" text,
    "Draft" text,
    "Created On" text,
    "Updated On" text,
    "Published On" text,
    "Featured Run Club" text,
    "Short bio" text,
    "Run Club site (primary)" text,
    "Run Club Instagram Page" text,
    "Run Club Strava Link" text,
    "Run Club Other Link" text,
    "Run Club Primary Location" text,
    "Primary location postcode" text,
    "State" text,
    "Primary Location: Latitude" text,
    "Primary Location: Longitude" text,
    "Clubs additional locations" text,
    "RUN 1" text,
    "RUN 2" text,
    "RUN 3" text,
    "RUN 4" text,
    "RUN 5" text,
    "RUN 6" text,
    "RUN 7" text,
    "Days" text,
    "Parkrun" text,
    "Free club" text,
    "Extra-curriculars" text,
    "Terrain" text,
    "Gender" text,
    "Run Club Photo" text,
    "Club Manager Contact Details" text
);


alter table "public"."run_clubs" alter column "latitude" set data type numeric(11,8) using "latitude"::numeric(11,8);

grant delete on table "public"."webflow_import" to "anon";

grant insert on table "public"."webflow_import" to "anon";

grant references on table "public"."webflow_import" to "anon";

grant select on table "public"."webflow_import" to "anon";

grant trigger on table "public"."webflow_import" to "anon";

grant truncate on table "public"."webflow_import" to "anon";

grant update on table "public"."webflow_import" to "anon";

grant delete on table "public"."webflow_import" to "authenticated";

grant insert on table "public"."webflow_import" to "authenticated";

grant references on table "public"."webflow_import" to "authenticated";

grant select on table "public"."webflow_import" to "authenticated";

grant trigger on table "public"."webflow_import" to "authenticated";

grant truncate on table "public"."webflow_import" to "authenticated";

grant update on table "public"."webflow_import" to "authenticated";

grant delete on table "public"."webflow_import" to "service_role";

grant insert on table "public"."webflow_import" to "service_role";

grant references on table "public"."webflow_import" to "service_role";

grant select on table "public"."webflow_import" to "service_role";

grant trigger on table "public"."webflow_import" to "service_role";

grant truncate on table "public"."webflow_import" to "service_role";

grant update on table "public"."webflow_import" to "service_role";


