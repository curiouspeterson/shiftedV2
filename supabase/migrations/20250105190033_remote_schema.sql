drop policy "Managers can manage all time off requests" on "public"."time_off_requests";

drop policy "Managers can view all time off requests" on "public"."time_off_requests";

drop policy "Users can delete own time off requests" on "public"."time_off_requests";

drop policy "Users can insert own time off requests" on "public"."time_off_requests";

drop policy "Users can update own time off requests" on "public"."time_off_requests";

drop policy "Users can view own time off requests" on "public"."time_off_requests";

revoke delete on table "public"."time_off_requests" from "anon";

revoke insert on table "public"."time_off_requests" from "anon";

revoke references on table "public"."time_off_requests" from "anon";

revoke select on table "public"."time_off_requests" from "anon";

revoke trigger on table "public"."time_off_requests" from "anon";

revoke truncate on table "public"."time_off_requests" from "anon";

revoke update on table "public"."time_off_requests" from "anon";

revoke delete on table "public"."time_off_requests" from "authenticated";

revoke insert on table "public"."time_off_requests" from "authenticated";

revoke references on table "public"."time_off_requests" from "authenticated";

revoke select on table "public"."time_off_requests" from "authenticated";

revoke trigger on table "public"."time_off_requests" from "authenticated";

revoke truncate on table "public"."time_off_requests" from "authenticated";

revoke update on table "public"."time_off_requests" from "authenticated";

revoke delete on table "public"."time_off_requests" from "service_role";

revoke insert on table "public"."time_off_requests" from "service_role";

revoke references on table "public"."time_off_requests" from "service_role";

revoke select on table "public"."time_off_requests" from "service_role";

revoke trigger on table "public"."time_off_requests" from "service_role";

revoke truncate on table "public"."time_off_requests" from "service_role";

revoke update on table "public"."time_off_requests" from "service_role";

alter table "public"."time_off_requests" drop constraint "time_off_requests_profile_id_fkey";

alter table "public"."time_off_requests" drop constraint "time_off_requests_status_check";

alter table "public"."time_off_requests" drop constraint "unique_time_off_request";

alter table "public"."time_off_requests" drop constraint "time_off_requests_pkey";

drop index if exists "public"."time_off_requests_pkey";

drop index if exists "public"."unique_time_off_request";

drop table "public"."time_off_requests";

alter table "public"."profiles" disable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_profile_raw(p_id uuid, p_full_name text, p_role text, p_email text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    updated_profile JSONB;
BEGIN
    -- Update the profile
    UPDATE public.profiles
    SET
        full_name = p_full_name,
        role = p_role,
        email = p_email,
        updated_at = NOW()
    WHERE id = p_id
    RETURNING to_jsonb(profiles.*) INTO updated_profile;

    -- Return the updated profile data
    RETURN updated_profile;
END;
$function$
;


