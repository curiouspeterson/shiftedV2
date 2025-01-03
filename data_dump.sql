--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8 (Debian 15.8-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: tenants; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY "_realtime"."tenants" ("id", "name", "external_id", "jwt_secret", "max_concurrent_users", "inserted_at", "updated_at", "max_events_per_second", "postgres_cdc_default", "max_bytes_per_second", "max_channels_per_client", "max_joins_per_second", "suspend", "jwt_jwks", "notify_private_alpha", "private_only") FROM stdin;
4a21ee27-4698-44d4-8854-f79d00c4832f	realtime-dev	realtime-dev	iNjicxc4+llvc9wovDvqymwfnj9teWMlyOIbJ8Fh6j2WNU8CIJ2ZgjR6MUIKqSmeDmvpsKLsZ9jgXJmQPpwL8w==	200	2025-01-03 20:11:43	2025-01-03 20:11:43	100	postgres_cdc_rls	100000	100	100	f	{"keys": [{"k": "c3VwZXItc2VjcmV0LWp3dC10b2tlbi13aXRoLWF0LWxlYXN0LTMyLWNoYXJhY3RlcnMtbG9uZw", "kty": "oct"}]}	t	f
\.


--
-- Data for Name: extensions; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY "_realtime"."extensions" ("id", "type", "settings", "tenant_external_id", "inserted_at", "updated_at") FROM stdin;
3fb59e0b-fae0-4876-9649-c1e7d284f7da	postgres_cdc_rls	{"region": "us-east-1", "db_host": "xwYn8QvN5TwM8kITUO2HmI6oNbCzIL/pAhhcL6QWnmk=", "db_name": "sWBpZNdjggEPTQVlI52Zfw==", "db_port": "+enMDFi1J/3IrrquHHwUmA==", "db_user": "uxbEq/zz8DXVD53TOI1zmw==", "slot_name": "supabase_realtime_replication_slot", "db_password": "sWBpZNdjggEPTQVlI52Zfw==", "publication": "supabase_realtime", "ssl_enforced": false, "poll_interval_ms": 100, "poll_max_changes": 100, "poll_max_record_bytes": 1048576}	realtime-dev	2025-01-03 20:11:43	2025-01-03 20:11:43
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY "_realtime"."schema_migrations" ("version", "inserted_at") FROM stdin;
20210706140551	2025-01-03 20:11:39
20220329161857	2025-01-03 20:11:39
20220410212326	2025-01-03 20:11:39
20220506102948	2025-01-03 20:11:39
20220527210857	2025-01-03 20:11:39
20220815211129	2025-01-03 20:11:39
20220815215024	2025-01-03 20:11:39
20220818141501	2025-01-03 20:11:39
20221018173709	2025-01-03 20:11:39
20221102172703	2025-01-03 20:11:39
20221223010058	2025-01-03 20:11:39
20230110180046	2025-01-03 20:11:39
20230810220907	2025-01-03 20:11:39
20230810220924	2025-01-03 20:11:39
20231024094642	2025-01-03 20:11:39
20240306114423	2025-01-03 20:11:39
20240418082835	2025-01-03 20:11:39
20240625211759	2025-01-03 20:11:39
20240704172020	2025-01-03 20:11:39
20240902173232	2025-01-03 20:11:39
20241106103258	2025-01-03 20:11:39
\.


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
\N	d0d54d58-7951-4de1-8827-7f6e7c162b0f	\N	\N	adam@example.com	$2a$06$ArD//bDReb9UVHhak7pPgeAttg7sApE9izHw/7mhyYKQwtaldG1i2	2025-01-03 20:11:41.260619+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"role": "manager", "full_name": "Adam Peterson", "weekly_hour_limit": 40}	\N	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00	\N	\N			\N		0	\N		\N	f	\N	f
\N	e9d54d58-7951-4de1-8827-7f6e7c162b0f	\N	\N	john@example.com	$2a$06$p35WmBKQBBFvXcZkgctx4e3OyOAv2lqgfvC7nSvr9S/HifkTSxd3u	2025-01-03 20:11:41.260619+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"role": "employee", "full_name": "John Doe", "weekly_hour_limit": 40}	\N	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00	\N	\N			\N		0	\N		\N	f	\N	f
\N	f8d54d58-7951-4de1-8827-7f6e7c162b0f	\N	\N	jane@example.com	$2a$06$zpZyCOKXeDh6jwCFBzs7f.daSg2la53HnOf9DZAdMojDvJEOOJegW	2025-01-03 20:11:41.260619+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"role": "employee", "full_name": "Jane Smith", "weekly_hour_limit": 40}	\N	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."schema_migrations" ("version") FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

COPY "pgsodium"."key" ("id", "status", "created", "expires", "key_type", "key_id", "key_context", "name", "associated_data", "raw_key", "raw_key_nonce", "parent_key", "comment", "user_data") FROM stdin;
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."profiles" ("id", "full_name", "email", "role", "weekly_hour_limit", "is_active", "created_at", "updated_at") FROM stdin;
d0d54d58-7951-4de1-8827-7f6e7c162b0f	Adam Peterson	adam@example.com	manager	40	t	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
e9d54d58-7951-4de1-8827-7f6e7c162b0f	John Doe	john@example.com	employee	40	t	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
f8d54d58-7951-4de1-8827-7f6e7c162b0f	Jane Smith	jane@example.com	employee	40	t	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
\.


--
-- Data for Name: employee_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."employee_availability" ("id", "profile_id", "day_of_week", "start_time", "end_time", "created_at") FROM stdin;
7bdb3993-fc19-4ffe-a093-cfcf4346f168	e9d54d58-7951-4de1-8827-7f6e7c162b0f	0	09:00:00	17:00:00	2025-01-03 20:11:41.260619+00
1b69729d-8691-4d31-98c3-e63fefbe299b	e9d54d58-7951-4de1-8827-7f6e7c162b0f	1	09:00:00	17:00:00	2025-01-03 20:11:41.260619+00
6980506b-dd6e-4fc4-ae3c-b401b3fb4d74	e9d54d58-7951-4de1-8827-7f6e7c162b0f	2	09:00:00	17:00:00	2025-01-03 20:11:41.260619+00
63171bdc-ad5d-4203-92e2-22c4d745fbfa	e9d54d58-7951-4de1-8827-7f6e7c162b0f	3	09:00:00	17:00:00	2025-01-03 20:11:41.260619+00
06517330-9ab5-4c37-b5f2-657cfd413f53	e9d54d58-7951-4de1-8827-7f6e7c162b0f	4	09:00:00	17:00:00	2025-01-03 20:11:41.260619+00
40a0187a-e498-41a8-a5b8-2052032f1d69	f8d54d58-7951-4de1-8827-7f6e7c162b0f	1	13:00:00	21:00:00	2025-01-03 20:11:41.260619+00
1313c5f2-830b-4d5f-9465-5bd5aa4664ae	f8d54d58-7951-4de1-8827-7f6e7c162b0f	2	13:00:00	21:00:00	2025-01-03 20:11:41.260619+00
3f97c6db-3ef9-447e-95ed-c963296ffb77	f8d54d58-7951-4de1-8827-7f6e7c162b0f	3	13:00:00	21:00:00	2025-01-03 20:11:41.260619+00
dfa1cd02-cd31-4d05-9f30-ba01b4db10d1	f8d54d58-7951-4de1-8827-7f6e7c162b0f	4	13:00:00	21:00:00	2025-01-03 20:11:41.260619+00
5baaef74-60e0-489e-a301-408336ee1e85	f8d54d58-7951-4de1-8827-7f6e7c162b0f	5	13:00:00	21:00:00	2025-01-03 20:11:41.260619+00
\.


--
-- Data for Name: shift_requirements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."shift_requirements" ("id", "name", "day_of_week", "start_time", "end_time", "required_count", "created_at", "updated_at") FROM stdin;
7d1c67da-8069-4410-a48e-c5aec6c22f61	Morning Shift	0	09:00:00	17:00:00	2	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
139afd16-2dc9-491e-856a-03249ca9c72c	Morning Shift	1	09:00:00	17:00:00	2	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
e387496a-7beb-4f62-9c81-a95366d5f3ce	Morning Shift	2	09:00:00	17:00:00	2	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
e0c38bf7-696c-4275-94ee-bdb3200e5ab0	Morning Shift	3	09:00:00	17:00:00	2	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
6c616f47-38a1-4884-8f51-48dadd934b21	Morning Shift	4	09:00:00	17:00:00	2	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
ebfef63c-1542-498a-ac67-c45160acef45	Morning Shift	5	09:00:00	17:00:00	1	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
597a705e-1d13-4f66-9839-22b858419e1d	Morning Shift	6	09:00:00	17:00:00	1	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
d97e2373-f31e-4612-b7ed-41f383926ea9	Evening Shift	1	13:00:00	21:00:00	2	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
48f23e2c-d171-4f71-95b1-3238c6321aaa	Evening Shift	2	13:00:00	21:00:00	2	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
aa0b202e-8563-4860-8586-264d47ead347	Evening Shift	3	13:00:00	21:00:00	2	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
bbbc2001-2288-4dc7-825c-484276e98f72	Evening Shift	4	13:00:00	21:00:00	2	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
ef580057-c2ad-4f95-89fd-f03b79b5e171	Evening Shift	5	13:00:00	21:00:00	1	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
bd147590-04ce-4330-91c7-d96ac99e3281	Evening Shift	6	13:00:00	21:00:00	1	2025-01-03 20:11:41.260619+00	2025-01-03 20:11:41.260619+00
\.


--
-- Data for Name: shift_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."shift_assignments" ("id", "profile_id", "shift_requirement_id", "date", "start_time", "end_time", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY "realtime"."schema_migrations" ("version", "inserted_at") FROM stdin;
20211116024918	2025-01-03 20:11:40
20211116045059	2025-01-03 20:11:40
20211116050929	2025-01-03 20:11:40
20211116051442	2025-01-03 20:11:40
20211116212300	2025-01-03 20:11:40
20211116213355	2025-01-03 20:11:40
20211116213934	2025-01-03 20:11:40
20211116214523	2025-01-03 20:11:40
20211122062447	2025-01-03 20:11:40
20211124070109	2025-01-03 20:11:40
20211202204204	2025-01-03 20:11:40
20211202204605	2025-01-03 20:11:40
20211210212804	2025-01-03 20:11:40
20211228014915	2025-01-03 20:11:40
20220107221237	2025-01-03 20:11:40
20220228202821	2025-01-03 20:11:40
20220312004840	2025-01-03 20:11:40
20220603231003	2025-01-03 20:11:40
20220603232444	2025-01-03 20:11:40
20220615214548	2025-01-03 20:11:40
20220712093339	2025-01-03 20:11:40
20220908172859	2025-01-03 20:11:40
20220916233421	2025-01-03 20:11:40
20230119133233	2025-01-03 20:11:40
20230128025114	2025-01-03 20:11:40
20230128025212	2025-01-03 20:11:40
20230227211149	2025-01-03 20:11:40
20230228184745	2025-01-03 20:11:40
20230308225145	2025-01-03 20:11:40
20230328144023	2025-01-03 20:11:40
20231018144023	2025-01-03 20:11:40
20231204144023	2025-01-03 20:11:40
20231204144024	2025-01-03 20:11:40
20231204144025	2025-01-03 20:11:40
20240108234812	2025-01-03 20:11:40
20240109165339	2025-01-03 20:11:40
20240227174441	2025-01-03 20:11:40
20240311171622	2025-01-03 20:11:40
20240321100241	2025-01-03 20:11:40
20240401105812	2025-01-03 20:11:40
20240418121054	2025-01-03 20:11:40
20240523004032	2025-01-03 20:11:40
20240618124746	2025-01-03 20:11:40
20240801235015	2025-01-03 20:11:40
20240805133720	2025-01-03 20:11:40
20240827160934	2025-01-03 20:11:40
20240919163303	2025-01-03 20:11:40
20240919163305	2025-01-03 20:11:40
20241019105805	2025-01-03 20:11:40
20241030150047	2025-01-03 20:11:40
20241108114728	2025-01-03 20:11:40
20241121104152	2025-01-03 20:11:40
20241130184212	2025-01-03 20:11:40
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY "realtime"."subscription" ("id", "subscription_id", "entity", "filters", "claims", "created_at") FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."migrations" ("id", "name", "hash", "executed_at") FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-01-03 20:11:40.715743
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-01-03 20:11:40.717511
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-01-03 20:11:40.718296
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-01-03 20:11:40.72214
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-01-03 20:11:40.726062
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-01-03 20:11:40.726955
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-01-03 20:11:40.728209
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-01-03 20:11:40.729212
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-01-03 20:11:40.730141
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-01-03 20:11:40.731136
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-01-03 20:11:40.732151
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-01-03 20:11:40.733382
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-01-03 20:11:40.734519
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-01-03 20:11:40.735494
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-01-03 20:11:40.736478
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-01-03 20:11:40.742819
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-01-03 20:11:40.743829
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-01-03 20:11:40.744604
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-01-03 20:11:40.745537
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-01-03 20:11:40.746685
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-01-03 20:11:40.747466
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-01-03 20:11:40.749116
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-01-03 20:11:40.753663
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-01-03 20:11:40.757393
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-01-03 20:11:40.75845
25	custom-metadata	67eb93b7e8d401cafcdc97f9ac779e71a79bfe03	2025-01-03 20:11:40.759266
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY "supabase_functions"."hooks" ("id", "hook_table_id", "hook_name", "created_at", "request_id") FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY "supabase_functions"."migrations" ("version", "inserted_at") FROM stdin;
initial	2025-01-03 20:11:29.204351+00
20210809183423_update_grants	2025-01-03 20:11:29.204351+00
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY "supabase_migrations"."schema_migrations" ("version", "statements", "name") FROM stdin;
20240101000000	{"-- Create profiles table\ncreate table if not exists public.profiles (\n    id uuid references auth.users on delete cascade primary key,\n    full_name text,\n    email text unique,\n    role text check (role in ('employee', 'manager')) not null default 'employee',\n    weekly_hour_limit integer not null default 40,\n    is_active boolean not null default true,\n    created_at timestamp with time zone not null default timezone('utc'::text, now()),\n    updated_at timestamp with time zone not null default timezone('utc'::text, now())\n)","-- Create employee_availability table\ncreate table if not exists public.employee_availability (\n    id uuid primary key default gen_random_uuid(),\n    profile_id uuid not null references public.profiles(id) on delete cascade,\n    day_of_week integer not null check (day_of_week between 0 and 6),\n    start_time time not null,\n    end_time time not null,\n    created_at timestamp with time zone not null default timezone('utc'::text, now()),\n    unique(profile_id, day_of_week)\n)","-- Create shift_requirements table\ncreate table if not exists public.shift_requirements (\n    id uuid primary key default gen_random_uuid(),\n    name text not null,\n    day_of_week integer not null check (day_of_week between 0 and 6),\n    start_time time not null,\n    end_time time not null,\n    required_count integer not null default 1,\n    created_at timestamp with time zone not null default timezone('utc'::text, now()),\n    updated_at timestamp with time zone not null default timezone('utc'::text, now())\n)","-- Create shift_assignments table\ncreate table if not exists public.shift_assignments (\n    id uuid primary key default gen_random_uuid(),\n    profile_id uuid not null references public.profiles(id) on delete cascade,\n    shift_requirement_id uuid not null references public.shift_requirements(id) on delete cascade,\n    date date not null,\n    start_time time not null,\n    end_time time not null,\n    created_at timestamp with time zone not null default timezone('utc'::text, now()),\n    updated_at timestamp with time zone not null default timezone('utc'::text, now()),\n    constraint unique_shift_assignment unique(profile_id, shift_requirement_id, date)\n)","-- Enable RLS on all tables\nalter table public.profiles enable row level security","alter table public.employee_availability enable row level security","alter table public.shift_requirements enable row level security","alter table public.shift_assignments enable row level security","-- RLS policies for profiles\ncreate policy \\"Users can view their own profile\\" on public.profiles for select using (auth.uid() = id)","create policy \\"Users can update their own profile\\" on public.profiles for update using (auth.uid() = id)","create policy \\"Managers can view all profiles\\" on public.profiles for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'))","create policy \\"Managers can update all profiles\\" on public.profiles for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'))","create policy \\"Managers can delete profiles\\" on public.profiles for delete using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'))","create policy \\"System can create profiles\\" on public.profiles for insert with check (true)","-- RLS policies for employee_availability\ncreate policy \\"Users can view own availability\\" on public.employee_availability for select using (auth.uid() = profile_id)","create policy \\"Users can insert own availability\\" on public.employee_availability for insert with check (auth.uid() = profile_id)","create policy \\"Users can update own availability\\" on public.employee_availability for update using (auth.uid() = profile_id)","create policy \\"Users can delete own availability\\" on public.employee_availability for delete using (auth.uid() = profile_id)","create policy \\"Managers can view all availability\\" on public.employee_availability for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'))","-- RLS policies for shift requirements\ncreate policy \\"Anyone can view shift requirements\\" on public.shift_requirements for select to authenticated using (true)","create policy \\"Managers can manage shift requirements\\" on public.shift_requirements for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'))","-- RLS policies for shift_assignments\ncreate policy \\"Users can view own assignments\\" on public.shift_assignments for select using (auth.uid() = profile_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'))","create policy \\"Users can update own assignments\\" on public.shift_assignments for update using (auth.uid() = profile_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'))","create policy \\"Managers can insert assignments\\" on public.shift_assignments for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'))","create policy \\"Managers can delete assignments\\" on public.shift_assignments for delete using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'))","-- Create function to handle new user creation\ncreate or replace function public.handle_new_user()\nreturns trigger\nlanguage plpgsql\nsecurity definer set search_path = public\nas $$\nbegin\n    insert into public.profiles (id, full_name, email, role, weekly_hour_limit, is_active)\n    values (\n        new.id,\n        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),\n        new.email,\n        coalesce(new.raw_user_meta_data->>'role', 'employee'),\n        coalesce((new.raw_user_meta_data->>'weekly_hour_limit')::integer, 40),\n        true\n    );\n    return new;\nend;\n$$","-- Create trigger for new user creation\ndrop trigger if exists on_auth_user_created on auth.users","create trigger on_auth_user_created\n    after insert on auth.users\n    for each row execute procedure public.handle_new_user()","-- Create function to update updated_at timestamp\ncreate or replace function public.update_updated_at()\nreturns trigger\nlanguage plpgsql\nas $$\nbegin\n    new.updated_at = now();\n    return new;\nend;\n$$","-- Create triggers to update updated_at timestamp on modification\ncreate trigger update_profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at()","create trigger update_shift_requirements_updated_at before update on public.shift_requirements for each row execute function public.update_updated_at()","create trigger update_shift_assignments_updated_at before update on public.shift_assignments for each row execute function public.update_updated_at()"}	create_initial_schema
\.


--
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY "supabase_migrations"."seed_files" ("path", "hash") FROM stdin;
supabase/seed.sql	21a44bf8d5c1cab2b08b7e46410afab44d57acea40de2e1a3bbb45183eadbb4b
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('"realtime"."subscription_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

