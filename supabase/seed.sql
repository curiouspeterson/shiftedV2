SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '2ba8f119-4588-4a8f-9cc1-480ac6d99761', '{"action":"user_signedup","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-01-03 22:39:35.272761+00', ''),
	('00000000-0000-0000-0000-000000000000', '94a3a2de-2aa0-42f1-9303-fac7a9027ff6', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-03 22:39:35.279727+00', ''),
	('00000000-0000-0000-0000-000000000000', '711d5624-1e98-430b-93e7-a34714f068da', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-03 22:40:08.240801+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ed716ac-2600-4952-9c28-8fa783ceadbb', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"test@test.com","user_id":"116b0084-1484-4693-82c7-1b978c7eb7ae","user_phone":""}}', '2025-01-03 22:40:33.340622+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e66ea8a4-b4bb-4c19-8568-a22f7382aa76', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-03 22:44:43.9936+00', ''),
	('00000000-0000-0000-0000-000000000000', '536649b2-38b4-4c10-a703-8e1f11ea0b72', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-03 22:45:02.196788+00', ''),
	('00000000-0000-0000-0000-000000000000', '75053e88-19f3-4a65-b679-83f38e4e9880', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-03 22:48:53.343548+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f6375c06-04fd-47ab-8ec4-e37f7c7df9af', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-03 22:51:07.932041+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b54cfa09-9126-4b46-aac2-16d1479f2bc4', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-03 22:54:15.124304+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ca8730e-b012-4cbc-8592-10eaa1138607', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-03 22:56:49.499795+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bba10b1c-a5ef-4d2f-9d3b-64200f9cca55', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-03 22:58:18.578382+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a073ae31-11da-43bc-8af9-9f456f263fa4', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-03 23:05:13.266972+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a269a9e7-1914-4740-a673-c0b9dc3299b7', '{"action":"user_signedup","actor_id":"d7bd3ce1-84ce-47a4-a3e1-b6093e02fb48","actor_name":"jo jo","actor_username":"jojo@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-01-03 23:05:37.108398+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca103108-9768-4109-adc1-3e6a696a78cf', '{"action":"login","actor_id":"d7bd3ce1-84ce-47a4-a3e1-b6093e02fb48","actor_name":"jo jo","actor_username":"jojo@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-03 23:05:37.114666+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd49f262a-622d-468a-8112-2b5ec0ac9d77', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-03 23:06:57.712741+00', ''),
	('00000000-0000-0000-0000-000000000000', '05e2b013-004e-496c-9bf7-08067079b937', '{"action":"user_signedup","actor_id":"dd07b36f-1ae6-4716-8fa0-5cc77273c049","actor_name":"banana nana","actor_username":"banana@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-01-03 23:07:18.365859+00', ''),
	('00000000-0000-0000-0000-000000000000', '6645b685-c4e0-40b3-8dc9-e8bf60d69c43', '{"action":"login","actor_id":"dd07b36f-1ae6-4716-8fa0-5cc77273c049","actor_name":"banana nana","actor_username":"banana@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-03 23:07:18.369438+00', ''),
	('00000000-0000-0000-0000-000000000000', '510ec5cc-d3cc-4555-9973-6d696dcdf928', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-04 18:12:06.025282+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ffd01007-42b5-4471-adc4-c43cea40afad', '{"action":"token_revoked","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-04 18:12:06.038726+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc9615d2-bee4-41d6-90aa-83dd86a92162', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-04 18:12:30.546357+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b12fd859-84f8-443c-8ab4-fbeb28455548', '{"action":"user_signedup","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-01-04 18:12:56.3499+00', ''),
	('00000000-0000-0000-0000-000000000000', '7f9b72b5-6e38-484c-8729-46c0ae463dec', '{"action":"login","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-04 18:12:56.354113+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ec6fd51-3bb4-448b-bb32-955857ec965e', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 02:08:29.637137+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4824f2e-21f8-4f40-be06-44914d067805', '{"action":"token_revoked","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 02:08:29.639779+00', ''),
	('00000000-0000-0000-0000-000000000000', '9bc1f709-6582-4f6f-83c1-c76f564c961c', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 03:02:29.794347+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b971721d-a578-4507-88f5-624aefef648b', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 03:08:29.876204+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e439b897-c4eb-423e-b0f6-ca9571c6dfd4', '{"action":"token_revoked","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 03:08:29.877013+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f23f977d-2dbd-44b9-b176-c927bb031c7f', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 03:08:38.84717+00', ''),
	('00000000-0000-0000-0000-000000000000', '947d09db-f0cc-4627-b8d9-49d7290d1848', '{"action":"user_signedup","actor_id":"c467ba6e-06c4-465e-a79d-da29a11b0c84","actor_name":"boog boob","actor_username":"boog@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-01-05 03:08:54.836099+00', ''),
	('00000000-0000-0000-0000-000000000000', '721fa5a5-48c8-4964-b0ad-928cb60a621d', '{"action":"login","actor_id":"c467ba6e-06c4-465e-a79d-da29a11b0c84","actor_name":"boog boob","actor_username":"boog@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 03:08:54.841579+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a0bb1e3-a40c-44e2-b7b7-eb5b314d5eb6', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 03:22:13.438046+00', ''),
	('00000000-0000-0000-0000-000000000000', '87dd9d8d-ccf3-4812-bd37-c078834f77ea', '{"action":"user_signedup","actor_id":"7b3e6eb8-8307-4678-98da-cbe3dc9be6bf","actor_name":"forge noop","actor_username":"fog@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-01-05 03:22:36.785142+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea38fbfa-122a-4240-ad1a-76748437df5e', '{"action":"login","actor_id":"7b3e6eb8-8307-4678-98da-cbe3dc9be6bf","actor_name":"forge noop","actor_username":"fog@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 03:22:36.788653+00', ''),
	('00000000-0000-0000-0000-000000000000', '0926f06f-77e1-4fad-bf92-90cfd9f21dd5', '{"action":"token_refreshed","actor_id":"7b3e6eb8-8307-4678-98da-cbe3dc9be6bf","actor_name":"forge noop","actor_username":"fog@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 16:19:44.647344+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f23a4a42-e80c-465e-b7c1-b1e12841f9bf', '{"action":"token_revoked","actor_id":"7b3e6eb8-8307-4678-98da-cbe3dc9be6bf","actor_name":"forge noop","actor_username":"fog@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 16:19:44.670752+00', ''),
	('00000000-0000-0000-0000-000000000000', '04d5629e-bb82-4018-83c5-5b81894de6be', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 16:22:41.774861+00', ''),
	('00000000-0000-0000-0000-000000000000', '103f9805-8835-453d-a7a9-f3ee8bdf6daf', '{"action":"token_revoked","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 16:22:41.7757+00', ''),
	('00000000-0000-0000-0000-000000000000', '1447704c-e4b7-401d-a959-8078d8e50006', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 16:22:52.691+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ef7c9fa-5cc4-4327-bf11-e20284db661e', '{"action":"user_signedup","actor_id":"62b3ec35-88fb-426c-a1f6-adce91488ebe","actor_name":"boots bum","actor_username":"bootsbum@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-01-05 16:23:15.118427+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f1414898-e980-4976-b30b-16169119bb27', '{"action":"login","actor_id":"62b3ec35-88fb-426c-a1f6-adce91488ebe","actor_name":"boots bum","actor_username":"bootsbum@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 16:23:15.123548+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e7a3c40-687f-4630-9925-50d390e9a159', '{"action":"token_refreshed","actor_id":"62b3ec35-88fb-426c-a1f6-adce91488ebe","actor_name":"boots bum","actor_username":"bootsbum@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 17:21:27.79597+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dccf86c1-7f03-45f6-9209-793410ec0e78', '{"action":"token_revoked","actor_id":"62b3ec35-88fb-426c-a1f6-adce91488ebe","actor_name":"boots bum","actor_username":"bootsbum@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 17:21:27.796803+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c708dfce-e3ab-44e1-8d61-9895e3849ebc', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 17:54:05.219642+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc058609-9f88-426e-bbe9-dfc9d0f81397', '{"action":"token_revoked","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 17:54:05.220517+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c32ee5d-7be7-4d14-8a3f-8d6de8705ebd', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 17:54:14.808918+00', ''),
	('00000000-0000-0000-0000-000000000000', '76906c56-3df9-49e4-97c0-dccc4fa9da04', '{"action":"user_signedup","actor_id":"f01fe93a-0659-4f2d-9a2f-b76afb4ad57a","actor_name":"Dont do it","actor_username":"donotbreakplease@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-01-05 17:54:41.210082+00', ''),
	('00000000-0000-0000-0000-000000000000', '6fb95bfe-893c-408a-b9a5-6c017a81c481', '{"action":"login","actor_id":"f01fe93a-0659-4f2d-9a2f-b76afb4ad57a","actor_name":"Dont do it","actor_username":"donotbreakplease@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 17:54:41.213777+00', ''),
	('00000000-0000-0000-0000-000000000000', '4941b28e-1171-4209-8156-55b384db41ec', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 18:00:14.951307+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfe9fffe-a823-4378-8a84-48145a75c27f', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 18:02:44.672527+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8048513-1992-4dff-abba-a9075a07bc0d', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 18:06:30.099078+00', ''),
	('00000000-0000-0000-0000-000000000000', '231803bb-c62f-4f29-9ef9-78743227c03f', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 18:11:02.168502+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da23f299-3d12-4c91-84a6-4d221b460d83', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 18:18:28.006649+00', ''),
	('00000000-0000-0000-0000-000000000000', '285c40cf-2b7e-4231-a007-705d90d084da', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 18:20:48.838834+00', ''),
	('00000000-0000-0000-0000-000000000000', '49158271-c4ca-42a6-b976-e9337015fcd0', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 18:27:31.03965+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e3ccb90f-247f-42fe-9b20-f66db01a2d0a', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 18:30:37.695061+00', ''),
	('00000000-0000-0000-0000-000000000000', '9766828c-1f36-4080-8655-f50c8378aced', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 18:32:27.183429+00', ''),
	('00000000-0000-0000-0000-000000000000', '00625324-4663-40a4-ad8a-13f16016851f', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 18:49:12.046184+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f9edb9e5-a072-44fd-ab2d-c4bdda1052f9', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 18:56:17.545241+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c51cb4a0-9018-4d78-9632-0a4bf7063984', '{"action":"token_revoked","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 18:56:17.546092+00', ''),
	('00000000-0000-0000-0000-000000000000', '566d7b27-06e6-4601-80f4-6d13430abfd2', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 18:58:17.889197+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c863e98-18d2-4c27-8739-3929b1a54014', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 19:07:40.330943+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac3de9d4-2c54-403d-858f-5959a2ad0b06', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 19:10:58.250697+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd00d3e6c-8f16-471a-875f-93e8f8426f7a', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 19:15:15.391187+00', ''),
	('00000000-0000-0000-0000-000000000000', '792ccae1-9621-40ac-a06d-0ab250a1ac1f', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 19:18:15.855624+00', ''),
	('00000000-0000-0000-0000-000000000000', '65cdf411-9f39-44ef-b892-efc0ba8d3cdb', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 19:21:37.992469+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bfc146ee-449d-4f90-b737-c016f7581f63', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 19:24:05.251801+00', ''),
	('00000000-0000-0000-0000-000000000000', '66c95562-3b81-44c4-b92d-45acad8d282a', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 19:26:39.759032+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd3d3e668-7f51-4d99-8bed-162ef1706d81', '{"action":"token_revoked","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 19:26:39.759938+00', ''),
	('00000000-0000-0000-0000-000000000000', '85139fe5-813d-4338-9740-11b98d1f8544', '{"action":"user_signedup","actor_id":"3b900bdc-3fe9-4ed7-9f17-ff01065f8341","actor_name":"Charlie Boogers","actor_username":"charlie@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-01-05 19:33:18.925172+00', ''),
	('00000000-0000-0000-0000-000000000000', '29cb1d00-8308-49a1-877e-277bbe25bc41', '{"action":"login","actor_id":"3b900bdc-3fe9-4ed7-9f17-ff01065f8341","actor_name":"Charlie Boogers","actor_username":"charlie@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 19:33:18.928992+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b62b554c-d756-4ea5-bcd7-09ae85748886', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 19:35:27.757904+00', ''),
	('00000000-0000-0000-0000-000000000000', '8350ea8a-d367-4b1b-822b-9ef037ccdd82', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"charlie@test.com","user_id":"3b900bdc-3fe9-4ed7-9f17-ff01065f8341","user_phone":""}}', '2025-01-05 19:54:48.089035+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f3673a63-5621-4152-b0ad-6c6dda82d1a5', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 19:59:22.837535+00', ''),
	('00000000-0000-0000-0000-000000000000', '11a5d9e1-ae37-4c9b-8865-46772e02fc44', '{"action":"token_revoked","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 19:59:22.839832+00', ''),
	('00000000-0000-0000-0000-000000000000', '86430a3a-7724-4194-8dc8-10e8227784a7', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 19:59:25.788766+00', ''),
	('00000000-0000-0000-0000-000000000000', 'beb316ca-6b84-49a8-8cff-b917eb8ae5f0', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 19:59:28.269829+00', ''),
	('00000000-0000-0000-0000-000000000000', '0a12151c-b60e-4503-b344-8a44a4fa50be', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 19:59:30.758512+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f610f957-821c-4aae-a8ef-eb663ee9472f', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 19:59:33.282847+00', ''),
	('00000000-0000-0000-0000-000000000000', '883ce013-bb9f-4290-ab9c-0ccb25b41e11', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 19:59:35.772119+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1d9a8e4-7e64-4033-b447-6dbef29caec2', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 19:59:38.237757+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ded7f2a5-b86c-47d7-9e82-55a9668d680d', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 19:59:40.778329+00', ''),
	('00000000-0000-0000-0000-000000000000', '7f57204c-c44c-4f1c-b237-799112b070c0', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 19:59:43.253046+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c4e31b40-8a4e-4e6c-b0a4-8f676bf4666d', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 20:01:02.80445+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f9598951-99fe-4881-95dc-cfb78a78bdf0', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 20:01:05.798552+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aa0de531-9b36-4d7b-af3f-762c85792411', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 20:01:08.270034+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8c48770-c3d7-4bb4-9ebe-024335579b27', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 20:01:10.783168+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6a3c0d7-61dd-4b16-8e70-641be27602b6', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 20:01:13.268127+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac4080b7-1b8f-439c-a6bd-5b5079c61597', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 20:01:15.762147+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4febba9-7745-4a60-8bee-61625d0e29c4', '{"action":"token_refreshed","actor_id":"dc621601-d60f-4b3c-84c5-e21e3fb88d7b","actor_name":"jobby nobo","actor_username":"jobby@test.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 20:01:59.346754+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ec502b6-3f21-4d61-af31-9108cf54004b', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 20:01:59.421736+00', ''),
	('00000000-0000-0000-0000-000000000000', '6dc01cdb-2200-4c9f-a0c4-3af4b43f23eb', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 20:57:35.088852+00', ''),
	('00000000-0000-0000-0000-000000000000', '7df6bd92-bf54-4170-be0e-f2a599d276b6', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:00:22.192157+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fb72c411-531b-4594-b725-2b113416886b', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:00:22.985897+00', ''),
	('00000000-0000-0000-0000-000000000000', '70942f86-c2be-47a2-9ad4-522ee21b649a', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:11:04.978352+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9f3d894-e35f-4b20-9896-f06e349dd053', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:12:02.250217+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cd1e983a-e336-4256-b19f-883886626de3', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:12:12.45746+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8d94b7b-0673-47df-b767-3c3132e0036d', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:15:20.828471+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5c92a13-9f1d-4e01-800f-0e0a02b15de0', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:16:22.217947+00', ''),
	('00000000-0000-0000-0000-000000000000', '81103879-2872-4119-bf2b-2fad0af24805', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:18:08.76907+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e548b25-af54-4837-b748-44e922c1ce11', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 21:24:22.959207+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a7903e1-0289-4b98-b74e-8308d79f8e89', '{"action":"token_revoked","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 21:24:22.96599+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a55acde8-197b-4888-b067-6b09b5a5c9b9', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:24:23.032342+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6dbe28f-f178-4e3e-a7dc-6305b53c7843', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:24:26.561345+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e19c26f7-0881-4ac0-a84e-89bd30c2c080', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:24:28.154747+00', ''),
	('00000000-0000-0000-0000-000000000000', '96d5bb7e-1ef5-4704-bb02-778908ffdfed', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:24:35.822897+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf4f2a63-7e17-4d91-b7a9-b14da391a42d', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:26:08.589059+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a8f5cbb-5e5b-4453-bb77-13dcaa62ca6f', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:26:21.634348+00', ''),
	('00000000-0000-0000-0000-000000000000', '3350949a-a038-47bd-8b67-69e5c3132bcf', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:26:27.914326+00', ''),
	('00000000-0000-0000-0000-000000000000', '8bbaf3f2-a82c-4761-95bf-8aceb99ae425', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:27:57.901465+00', ''),
	('00000000-0000-0000-0000-000000000000', '22c2eccd-9cc4-48d3-9f19-3fa0f16a2277', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:29:28.067853+00', ''),
	('00000000-0000-0000-0000-000000000000', '04cea873-e2c9-41c5-81c9-101b07608171', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:30:39.391102+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a3e7e493-16c6-4322-9114-8fc39b839dc0', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:32:37.528043+00', ''),
	('00000000-0000-0000-0000-000000000000', '19605235-825e-41ef-9d5b-1e76bcef8ac4', '{"action":"login","actor_id":"3e11310a-844b-45b3-9902-363d5086ce0a","actor_username":"davide@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-06 00:52:48.289849+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b4375152-b064-436b-80d0-6911e4bacb75', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:32:43.592892+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f3374f0a-7758-4b78-8332-8db31a0b8188', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:35:16.714198+00', ''),
	('00000000-0000-0000-0000-000000000000', '48e2f176-7438-4f50-8c0d-94514d782953', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:36:50.30687+00', ''),
	('00000000-0000-0000-0000-000000000000', '307610aa-dbdc-41c2-ba65-e0c9d8b577a7', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:38:11.897604+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aa311e28-4b32-4535-89d3-3aa86c83ac99', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:38:16.406136+00', ''),
	('00000000-0000-0000-0000-000000000000', '6368ffe0-c2d9-4f82-9c05-3335aee0003f', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:39:19.218713+00', ''),
	('00000000-0000-0000-0000-000000000000', '3ac3bbe1-5d90-4ec0-ba62-1851f5f52ded', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:39:50.079018+00', ''),
	('00000000-0000-0000-0000-000000000000', '97763432-5bc5-4a69-ba39-8534af86999d', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:41:06.147614+00', ''),
	('00000000-0000-0000-0000-000000000000', '09d8db9c-6445-435f-a226-515a7f4d9430', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:43:48.741343+00', ''),
	('00000000-0000-0000-0000-000000000000', '08b6891a-4392-4720-a302-064ad4dd0f4d', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:44:57.876308+00', ''),
	('00000000-0000-0000-0000-000000000000', '08bc551d-9401-41c2-bd6a-f682efee4990', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:47:22.093844+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e829fe84-f442-43fa-9dd5-492964893fb6', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 21:47:36.737222+00', ''),
	('00000000-0000-0000-0000-000000000000', '7f440b75-2bbe-4b92-96c1-59e7e7504c29', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"boog@test.com","user_id":"c467ba6e-06c4-465e-a79d-da29a11b0c84","user_phone":""}}', '2025-01-05 22:16:51.246583+00', ''),
	('00000000-0000-0000-0000-000000000000', '01e2c464-cae6-4f4b-898a-7c0b1d7e6349', '{"action":"logout","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-01-05 22:44:56.96791+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ecb7bc04-73e9-48b3-8a01-03b72f4a669d', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-05 22:45:06.078256+00', ''),
	('00000000-0000-0000-0000-000000000000', '2399518d-aff0-4881-af6f-0a70191af55c', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 23:48:05.477415+00', ''),
	('00000000-0000-0000-0000-000000000000', '0d2e3e89-a0c2-43ae-816f-7f8c32a41523', '{"action":"token_revoked","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-05 23:48:05.478302+00', ''),
	('00000000-0000-0000-0000-000000000000', '57a4a3a6-2f5d-49db-bfd7-ac147c61060f', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-06 00:13:39.634687+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c31844e2-aab7-4fc5-957a-296f95208023', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"donotbreakplease@test.com","user_id":"f01fe93a-0659-4f2d-9a2f-b76afb4ad57a","user_phone":""}}', '2025-01-06 00:36:15.428905+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4952740-707c-4df3-9250-5ddaaea7de48', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-06 00:40:45.214278+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a2f809c5-e328-4f26-940f-ad93100fcd3c', '{"action":"logout","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-01-06 00:43:40.054738+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d2ae869-db4f-4e47-80d8-fe5033974c3e', '{"action":"user_signedup","actor_id":"3e11310a-844b-45b3-9902-363d5086ce0a","actor_username":"davide@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-01-06 00:44:10.089838+00', ''),
	('00000000-0000-0000-0000-000000000000', '98c4a90c-a680-4f03-8e37-38de2bb99b01', '{"action":"login","actor_id":"3e11310a-844b-45b3-9902-363d5086ce0a","actor_username":"davide@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-06 00:44:10.095521+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ebe62b12-d1af-4c6d-b86e-95dc119be874', '{"action":"logout","actor_id":"3e11310a-844b-45b3-9902-363d5086ce0a","actor_username":"davide@test.com","actor_via_sso":false,"log_type":"account"}', '2025-01-06 00:44:21.497908+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf0356b2-af52-447b-b8df-b911177d1f36', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-06 00:44:24.353081+00', ''),
	('00000000-0000-0000-0000-000000000000', '5384205f-f58a-48d4-98cf-be1880f56898', '{"action":"logout","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-01-06 00:45:59.212458+00', ''),
	('00000000-0000-0000-0000-000000000000', '1b7daec6-2fdf-44bf-b4ca-63bf3cb19002', '{"action":"login","actor_id":"3e11310a-844b-45b3-9902-363d5086ce0a","actor_username":"davide@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-06 00:46:08.608976+00', ''),
	('00000000-0000-0000-0000-000000000000', '1bceabb9-7206-4469-b599-6f193bd29f98', '{"action":"logout","actor_id":"3e11310a-844b-45b3-9902-363d5086ce0a","actor_username":"davide@test.com","actor_via_sso":false,"log_type":"account"}', '2025-01-06 00:47:15.611766+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ddccf79e-d445-453c-80d9-c7a3b7eafbf3', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-06 17:59:28.03036+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ab9a1e4-da98-41aa-bda5-876b7d0f8002', '{"action":"login","actor_id":"3e11310a-844b-45b3-9902-363d5086ce0a","actor_username":"davide@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-06 20:44:42.158883+00', ''),
	('00000000-0000-0000-0000-000000000000', '02adb0d9-57be-4bab-ba27-d5f427929bf6', '{"action":"login","actor_id":"3e11310a-844b-45b3-9902-363d5086ce0a","actor_username":"davide@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-06 20:44:44.728372+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5efa7e5-5c1f-469e-843b-1873c8482751', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:11:25.783219+00', ''),
	('00000000-0000-0000-0000-000000000000', '905f1e23-6b8d-4a44-8826-241b84d606b7', '{"action":"token_revoked","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:11:25.784804+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e163c6b4-d18e-41b0-becd-9ac0b1616e09', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:12:47.483239+00', ''),
	('00000000-0000-0000-0000-000000000000', '22be7d9d-fbbe-4278-8fb8-6d210478d71b', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:13:04.755922+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7aad0a3-2423-40fc-9241-930655bc8819', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:13:07.554519+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b3a8693-f0bf-46ae-bbfc-9ebb839709d4', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:13:10.093023+00', ''),
	('00000000-0000-0000-0000-000000000000', '679e19c1-3be5-40b7-b37e-401aa122184d', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:13:12.703041+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cda6772b-c0c6-4790-9e43-fb02334c4fd8', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:13:15.310064+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e3843c62-1126-4ab4-bf0d-f38d47c32c16', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:16:01.711622+00', ''),
	('00000000-0000-0000-0000-000000000000', '7d9a6f2d-8888-4782-8ece-5e086d64a0ab', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:16:04.721146+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dacfe8bb-b68a-44a0-bfee-8d9706827752', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:16:07.220558+00', ''),
	('00000000-0000-0000-0000-000000000000', '96d01d75-e843-4e76-8379-042a46fcb13c', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:16:09.697427+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf53a1b0-a664-438d-97d5-e24f01d71c02', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:16:12.28158+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb92c622-3aa8-44b2-a99b-305bec939143', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 21:19:44.785977+00', ''),
	('00000000-0000-0000-0000-000000000000', '82360196-f2da-423d-81d8-d988a1aacee2', '{"action":"logout","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-01-06 21:34:11.853262+00', ''),
	('00000000-0000-0000-0000-000000000000', '93ddccb2-f9ad-403e-a13d-dd314064e536', '{"action":"login","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-06 21:34:19.172134+00', ''),
	('00000000-0000-0000-0000-000000000000', '19698a10-9fd4-4607-b9a8-35f78e2c7772', '{"action":"login","actor_id":"3e11310a-844b-45b3-9902-363d5086ce0a","actor_username":"davide@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-06 22:15:09.234847+00', ''),
	('00000000-0000-0000-0000-000000000000', '31eea465-18ee-4f03-b2d6-428c0a21ba94', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 22:34:29.159222+00', ''),
	('00000000-0000-0000-0000-000000000000', '3f5b9b30-b674-46a7-86c2-067f71bc4e9d', '{"action":"token_revoked","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 22:34:29.161889+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd68661ff-57a6-4516-82bd-8c6dfe9698ca', '{"action":"token_refreshed","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 23:32:35.993983+00', ''),
	('00000000-0000-0000-0000-000000000000', '1893a291-2918-414b-9c11-362c9ef530ba', '{"action":"token_revoked","actor_id":"a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269","actor_name":"Adam Peterson","actor_username":"adambpeterson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-06 23:32:36.000056+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'dd07b36f-1ae6-4716-8fa0-5cc77273c049', 'authenticated', 'authenticated', 'banana@test.com', '$2a$10$OmoIDf0rRjdqU30.XnGxgunrJKaqbLAiNBqG/Y8fxV1FhHXSiypS.', '2025-01-03 23:07:18.366324+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-01-03 23:07:18.369934+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "dd07b36f-1ae6-4716-8fa0-5cc77273c049", "role": "employee", "email": "banana@test.com", "full_name": "banana nana", "email_verified": true, "phone_verified": false}', NULL, '2025-01-03 23:07:18.358102+00', '2025-01-03 23:07:18.37222+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'dc621601-d60f-4b3c-84c5-e21e3fb88d7b', 'authenticated', 'authenticated', 'jobby@test.com', '$2a$10$PWrAzCdAGkmzxEl98cVSz.XNinHIatIAP2gDeyxMKoa1CHbOke.di', '2025-01-04 18:12:56.350389+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-01-04 18:12:56.354596+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "dc621601-d60f-4b3c-84c5-e21e3fb88d7b", "role": "manager", "email": "jobby@test.com", "full_name": "jobby nobo", "email_verified": true, "phone_verified": false}', NULL, '2025-01-04 18:12:56.320605+00', '2025-01-05 19:59:22.842603+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '7b3e6eb8-8307-4678-98da-cbe3dc9be6bf', 'authenticated', 'authenticated', 'fog@test.com', '$2a$10$X61amHjQyUxbRh08zBw2seWsbiHgPpiytQQb1SbHn046qW8XQZHEm', '2025-01-05 03:22:36.785625+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-01-05 03:22:36.789079+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "7b3e6eb8-8307-4678-98da-cbe3dc9be6bf", "role": "employee", "email": "fog@test.com", "full_name": "forge noop", "email_verified": true, "phone_verified": false}', NULL, '2025-01-05 03:22:36.777699+00', '2025-01-05 16:19:44.681062+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd7bd3ce1-84ce-47a4-a3e1-b6093e02fb48', 'authenticated', 'authenticated', 'jojo@test.com', '$2a$10$WEf76Bh8rMbmxoptzUmYmeT2mMKPOVuChzJ66fumkqo/ThnhOy0ZK', '2025-01-03 23:05:37.108884+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-01-03 23:05:37.11512+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "d7bd3ce1-84ce-47a4-a3e1-b6093e02fb48", "role": "employee", "email": "jojo@test.com", "full_name": "jo jo", "email_verified": true, "phone_verified": false}', NULL, '2025-01-03 23:05:37.092824+00', '2025-01-03 23:05:37.117646+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '116b0084-1484-4693-82c7-1b978c7eb7ae', 'authenticated', 'authenticated', 'test@test.com', '$2a$10$Rady4mPBypZLBS7APChSBe.N9XkCM6ATGPXnkekjwXV4l8Y7y4eRm', '2025-01-03 22:40:33.341568+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"role": "employee", "full_name": "testerino", "email_verified": true}', NULL, '2025-01-03 22:40:33.338387+00', '2025-01-03 22:40:33.342388+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '3e11310a-844b-45b3-9902-363d5086ce0a', 'authenticated', 'authenticated', 'davide@test.com', '$2a$10$eWvG6OiNu3PdmB9jJFYG3OQ0NftkKwSMW.OyJUhjwjlEq.03CkUz2', '2025-01-06 00:44:10.092261+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-01-06 22:15:09.240107+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "3e11310a-844b-45b3-9902-363d5086ce0a", "email": "davide@test.com", "email_verified": true, "phone_verified": false}', NULL, '2025-01-06 00:44:10.066033+00', '2025-01-06 22:15:09.245262+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '62b3ec35-88fb-426c-a1f6-adce91488ebe', 'authenticated', 'authenticated', 'bootsbum@test.com', '$2a$10$L6NFCvwoBby5aEcdJDGUpO.kBUek1tYVmONpxHAwcxg2CgvonfSWC', '2025-01-05 16:23:15.118934+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-01-05 16:23:15.124061+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "62b3ec35-88fb-426c-a1f6-adce91488ebe", "role": "employee", "email": "bootsbum@test.com", "full_name": "boots bum", "email_verified": true, "phone_verified": false}', NULL, '2025-01-05 16:23:15.099502+00', '2025-01-05 17:21:27.798812+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 'authenticated', 'authenticated', 'adambpeterson@gmail.com', '$2a$10$Mb/5eZT4gp1pNNSndYPu3O/tmi5kh1mXBzc7fSJ8EzpYWuBF5QzMK', '2025-01-03 22:39:35.275467+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-01-06 21:34:19.17282+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269", "email": "adambpeterson@gmail.com", "full_name": "Adam Peterson", "email_verified": true, "phone_verified": false}', NULL, '2025-01-03 22:39:35.247577+00', '2025-01-06 23:32:36.009578+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', '{"sub": "a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269", "email": "adambpeterson@gmail.com", "full_name": "Adam Peterson", "email_verified": false, "phone_verified": false}', 'email', '2025-01-03 22:39:35.269349+00', '2025-01-03 22:39:35.269404+00', '2025-01-03 22:39:35.269404+00', '18fdb8d9-0c26-4c69-8ac7-df4c99796134'),
	('116b0084-1484-4693-82c7-1b978c7eb7ae', '116b0084-1484-4693-82c7-1b978c7eb7ae', '{"sub": "116b0084-1484-4693-82c7-1b978c7eb7ae", "email": "test@test.com", "email_verified": false, "phone_verified": false}', 'email', '2025-01-03 22:40:33.339876+00', '2025-01-03 22:40:33.339931+00', '2025-01-03 22:40:33.339931+00', '18cdb334-3390-43a8-a836-89a8e6955cd4'),
	('d7bd3ce1-84ce-47a4-a3e1-b6093e02fb48', 'd7bd3ce1-84ce-47a4-a3e1-b6093e02fb48', '{"sub": "d7bd3ce1-84ce-47a4-a3e1-b6093e02fb48", "role": "employee", "email": "jojo@test.com", "full_name": "jo jo", "email_verified": false, "phone_verified": false}', 'email', '2025-01-03 23:05:37.1047+00', '2025-01-03 23:05:37.104748+00', '2025-01-03 23:05:37.104748+00', '938587f7-6e53-4e50-85ea-49c9d7a248e2'),
	('dd07b36f-1ae6-4716-8fa0-5cc77273c049', 'dd07b36f-1ae6-4716-8fa0-5cc77273c049', '{"sub": "dd07b36f-1ae6-4716-8fa0-5cc77273c049", "role": "employee", "email": "banana@test.com", "full_name": "banana nana", "email_verified": false, "phone_verified": false}', 'email', '2025-01-03 23:07:18.363385+00', '2025-01-03 23:07:18.36343+00', '2025-01-03 23:07:18.36343+00', '10e180a8-484c-4f3e-aaf5-2ca0649509dd'),
	('dc621601-d60f-4b3c-84c5-e21e3fb88d7b', 'dc621601-d60f-4b3c-84c5-e21e3fb88d7b', '{"sub": "dc621601-d60f-4b3c-84c5-e21e3fb88d7b", "role": "manager", "email": "jobby@test.com", "full_name": "jobby nobo", "email_verified": false, "phone_verified": false}', 'email', '2025-01-04 18:12:56.344936+00', '2025-01-04 18:12:56.344982+00', '2025-01-04 18:12:56.344982+00', 'ff2da8b8-0fce-4992-add7-7498bc4f1661'),
	('7b3e6eb8-8307-4678-98da-cbe3dc9be6bf', '7b3e6eb8-8307-4678-98da-cbe3dc9be6bf', '{"sub": "7b3e6eb8-8307-4678-98da-cbe3dc9be6bf", "role": "employee", "email": "fog@test.com", "full_name": "forge noop", "email_verified": false, "phone_verified": false}', 'email', '2025-01-05 03:22:36.782139+00', '2025-01-05 03:22:36.78219+00', '2025-01-05 03:22:36.78219+00', 'c94b4f26-4dfa-4b84-b615-f99132a5e9e4'),
	('62b3ec35-88fb-426c-a1f6-adce91488ebe', '62b3ec35-88fb-426c-a1f6-adce91488ebe', '{"sub": "62b3ec35-88fb-426c-a1f6-adce91488ebe", "role": "employee", "email": "bootsbum@test.com", "full_name": "boots bum", "email_verified": false, "phone_verified": false}', 'email', '2025-01-05 16:23:15.115363+00', '2025-01-05 16:23:15.115413+00', '2025-01-05 16:23:15.115413+00', '24cbb70b-15d6-4599-9dcb-8b2693b9152d'),
	('3e11310a-844b-45b3-9902-363d5086ce0a', '3e11310a-844b-45b3-9902-363d5086ce0a', '{"sub": "3e11310a-844b-45b3-9902-363d5086ce0a", "email": "davide@test.com", "email_verified": false, "phone_verified": false}', 'email', '2025-01-06 00:44:10.0824+00', '2025-01-06 00:44:10.082464+00', '2025-01-06 00:44:10.082464+00', 'eda6d88b-0809-4e0b-9e9a-85332883f266');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('0a560a81-ba55-49c9-816e-749e82c7d1fe', '3e11310a-844b-45b3-9902-363d5086ce0a', '2025-01-06 20:44:42.159959+00', '2025-01-06 20:44:42.159959+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', '174.194.198.220', NULL),
	('1c97a6a2-71fd-4c61-84a7-167a07d30d80', '3e11310a-844b-45b3-9902-363d5086ce0a', '2025-01-06 20:44:44.729107+00', '2025-01-06 20:44:44.729107+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', '174.194.198.220', NULL),
	('3fde30d4-ba00-4b08-a7a0-c41b65b1d2ef', 'd7bd3ce1-84ce-47a4-a3e1-b6093e02fb48', '2025-01-03 23:05:37.115186+00', '2025-01-03 23:05:37.115186+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15', '98.35.199.33', NULL),
	('27a78b44-934e-40e0-80d9-aee1d82e1411', 'dd07b36f-1ae6-4716-8fa0-5cc77273c049', '2025-01-03 23:07:18.370006+00', '2025-01-03 23:07:18.370006+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15', '98.35.199.33', NULL),
	('cdfd3cc5-c5b8-4df3-ad83-b3347fe33f5f', '7b3e6eb8-8307-4678-98da-cbe3dc9be6bf', '2025-01-05 03:22:36.789148+00', '2025-01-05 16:19:44.687268+00', NULL, 'aal1', NULL, '2025-01-05 16:19:44.687184', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15', '98.35.199.33', NULL),
	('25840cb0-ee25-4968-9708-01964d6d9070', '62b3ec35-88fb-426c-a1f6-adce91488ebe', '2025-01-05 16:23:15.124144+00', '2025-01-05 17:21:27.800973+00', NULL, 'aal1', NULL, '2025-01-05 17:21:27.800199', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15', '98.35.199.33', NULL),
	('9089d96c-68c9-4987-b3eb-f559b5f7e2a3', 'dc621601-d60f-4b3c-84c5-e21e3fb88d7b', '2025-01-04 18:12:56.354659+00', '2025-01-05 20:01:59.347771+00', NULL, 'aal1', NULL, '2025-01-05 20:01:59.347703', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15', '98.35.199.33', NULL),
	('ad412c44-1be3-4064-b455-f4936c489bbb', '3e11310a-844b-45b3-9902-363d5086ce0a', '2025-01-06 00:52:48.292289+00', '2025-01-06 00:52:48.292289+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36', '67.170.234.171', NULL),
	('92bd7bcc-6740-4cb2-bc03-17aa006d28e4', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', '2025-01-06 21:34:19.172898+00', '2025-01-06 23:32:36.010683+00', NULL, 'aal1', NULL, '2025-01-06 23:32:36.010614', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15', '98.35.199.33', NULL),
	('ed140050-9815-4e58-bc21-7512a4595490', '3e11310a-844b-45b3-9902-363d5086ce0a', '2025-01-06 22:15:09.240183+00', '2025-01-06 22:15:09.240183+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15', '98.35.199.33', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('ad412c44-1be3-4064-b455-f4936c489bbb', '2025-01-06 00:52:48.295269+00', '2025-01-06 00:52:48.295269+00', 'password', '6234e37a-a5df-4dac-b05e-2e1988689ead'),
	('0a560a81-ba55-49c9-816e-749e82c7d1fe', '2025-01-06 20:44:42.165299+00', '2025-01-06 20:44:42.165299+00', 'password', '3c069c57-90b4-41c0-932f-61e62a4e76b6'),
	('1c97a6a2-71fd-4c61-84a7-167a07d30d80', '2025-01-06 20:44:44.730965+00', '2025-01-06 20:44:44.730965+00', 'password', 'a643916f-f091-4369-b036-6dbb33343354'),
	('92bd7bcc-6740-4cb2-bc03-17aa006d28e4', '2025-01-06 21:34:19.178746+00', '2025-01-06 21:34:19.178746+00', 'password', 'e4835bd5-8a02-4bcf-a291-409f1783c0b3'),
	('3fde30d4-ba00-4b08-a7a0-c41b65b1d2ef', '2025-01-03 23:05:37.117908+00', '2025-01-03 23:05:37.117908+00', 'password', 'b5f32e7a-962e-4c7e-9536-d99943afc4ad'),
	('ed140050-9815-4e58-bc21-7512a4595490', '2025-01-06 22:15:09.245795+00', '2025-01-06 22:15:09.245795+00', 'password', 'e2b654fb-c7c7-4864-ada5-e458451da5e6'),
	('27a78b44-934e-40e0-80d9-aee1d82e1411', '2025-01-03 23:07:18.372491+00', '2025-01-03 23:07:18.372491+00', 'password', '9959f98d-5bc3-4047-ac28-939c06322116'),
	('9089d96c-68c9-4987-b3eb-f559b5f7e2a3', '2025-01-04 18:12:56.356347+00', '2025-01-04 18:12:56.356347+00', 'password', '2ff26a24-711c-4318-b1a4-00bfc985f74b'),
	('cdfd3cc5-c5b8-4df3-ad83-b3347fe33f5f', '2025-01-05 03:22:36.79096+00', '2025-01-05 03:22:36.79096+00', 'password', '3673aa5e-c908-42e9-970b-f46ec3a5d6b8'),
	('25840cb0-ee25-4968-9708-01964d6d9070', '2025-01-05 16:23:15.12661+00', '2025-01-05 16:23:15.12661+00', 'password', '70b38a8c-8f95-44d1-8fd0-dd846adf6855');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 101, 'nhTIg4KkXFuxhgpjlNTNeg', '3e11310a-844b-45b3-9902-363d5086ce0a', false, '2025-01-06 22:15:09.242543+00', '2025-01-06 22:15:09.242543+00', NULL, 'ed140050-9815-4e58-bc21-7512a4595490'),
	('00000000-0000-0000-0000-000000000000', 103, 'lOvhzeW1pYM_RYtyZzQYkw', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', false, '2025-01-06 23:32:36.006441+00', '2025-01-06 23:32:36.006441+00', 'STISCmFpJBT_IurRJGhf4w', '92bd7bcc-6740-4cb2-bc03-17aa006d28e4'),
	('00000000-0000-0000-0000-000000000000', 11, 'YM2Rw-8ml094HQviVQorvw', 'd7bd3ce1-84ce-47a4-a3e1-b6093e02fb48', false, '2025-01-03 23:05:37.116791+00', '2025-01-03 23:05:37.116791+00', NULL, '3fde30d4-ba00-4b08-a7a0-c41b65b1d2ef'),
	('00000000-0000-0000-0000-000000000000', 13, 'woEqfVhl9PWMvNfDj8weTg', 'dd07b36f-1ae6-4716-8fa0-5cc77273c049', false, '2025-01-03 23:07:18.371373+00', '2025-01-03 23:07:18.371373+00', NULL, '27a78b44-934e-40e0-80d9-aee1d82e1411'),
	('00000000-0000-0000-0000-000000000000', 29, '5t7SifogHHdm1nblZqv-5g', 'dc621601-d60f-4b3c-84c5-e21e3fb88d7b', true, '2025-01-05 17:54:05.221585+00', '2025-01-05 18:56:17.546634+00', 'M77N-IifYl7NvK3OA29vFQ', '9089d96c-68c9-4987-b3eb-f559b5f7e2a3'),
	('00000000-0000-0000-0000-000000000000', 16, 'NbXDrND9TtcT5Ph0mNxhAQ', 'dc621601-d60f-4b3c-84c5-e21e3fb88d7b', true, '2025-01-04 18:12:56.355263+00', '2025-01-05 02:08:29.640276+00', NULL, '9089d96c-68c9-4987-b3eb-f559b5f7e2a3'),
	('00000000-0000-0000-0000-000000000000', 17, '5nmOCbEI4bqkvbGlgO9vYQ', 'dc621601-d60f-4b3c-84c5-e21e3fb88d7b', true, '2025-01-05 02:08:29.643125+00', '2025-01-05 03:08:29.877476+00', 'NbXDrND9TtcT5Ph0mNxhAQ', '9089d96c-68c9-4987-b3eb-f559b5f7e2a3'),
	('00000000-0000-0000-0000-000000000000', 23, '4-gzknJW4t68RoBhnRnpMw', '7b3e6eb8-8307-4678-98da-cbe3dc9be6bf', true, '2025-01-05 03:22:36.78979+00', '2025-01-05 16:19:44.672105+00', NULL, 'cdfd3cc5-c5b8-4df3-ad83-b3347fe33f5f'),
	('00000000-0000-0000-0000-000000000000', 24, 'Ua_fy3ql5yMGo9WhdwBUFw', '7b3e6eb8-8307-4678-98da-cbe3dc9be6bf', false, '2025-01-05 16:19:44.679982+00', '2025-01-05 16:19:44.679982+00', '4-gzknJW4t68RoBhnRnpMw', 'cdfd3cc5-c5b8-4df3-ad83-b3347fe33f5f'),
	('00000000-0000-0000-0000-000000000000', 19, 'VPRFsxwHUiiq8bHck_ZN9Q', 'dc621601-d60f-4b3c-84c5-e21e3fb88d7b', true, '2025-01-05 03:08:29.878829+00', '2025-01-05 16:22:41.776183+00', '5nmOCbEI4bqkvbGlgO9vYQ', '9089d96c-68c9-4987-b3eb-f559b5f7e2a3'),
	('00000000-0000-0000-0000-000000000000', 27, 'adtZzaNirtKJmtSwXKv1cg', '62b3ec35-88fb-426c-a1f6-adce91488ebe', true, '2025-01-05 16:23:15.125441+00', '2025-01-05 17:21:27.797286+00', NULL, '25840cb0-ee25-4968-9708-01964d6d9070'),
	('00000000-0000-0000-0000-000000000000', 28, 'zl29QkIuftE8dTLSxEZmYA', '62b3ec35-88fb-426c-a1f6-adce91488ebe', false, '2025-01-05 17:21:27.797836+00', '2025-01-05 17:21:27.797836+00', 'adtZzaNirtKJmtSwXKv1cg', '25840cb0-ee25-4968-9708-01964d6d9070'),
	('00000000-0000-0000-0000-000000000000', 25, 'M77N-IifYl7NvK3OA29vFQ', 'dc621601-d60f-4b3c-84c5-e21e3fb88d7b', true, '2025-01-05 16:22:41.777461+00', '2025-01-05 17:54:05.221015+00', 'VPRFsxwHUiiq8bHck_ZN9Q', '9089d96c-68c9-4987-b3eb-f559b5f7e2a3'),
	('00000000-0000-0000-0000-000000000000', 42, 'udb78YYTXWFDUpgG2DA1JA', 'dc621601-d60f-4b3c-84c5-e21e3fb88d7b', true, '2025-01-05 18:56:17.547974+00', '2025-01-05 19:59:22.840309+00', '5t7SifogHHdm1nblZqv-5g', '9089d96c-68c9-4987-b3eb-f559b5f7e2a3'),
	('00000000-0000-0000-0000-000000000000', 53, '8IoQwrKnrqhkrI97nUGbJQ', 'dc621601-d60f-4b3c-84c5-e21e3fb88d7b', false, '2025-01-05 19:59:22.841622+00', '2025-01-05 19:59:22.841622+00', 'udb78YYTXWFDUpgG2DA1JA', '9089d96c-68c9-4987-b3eb-f559b5f7e2a3'),
	('00000000-0000-0000-0000-000000000000', 95, 'uFYBKTRbUDuTZ8qk__wnIw', '3e11310a-844b-45b3-9902-363d5086ce0a', false, '2025-01-06 00:52:48.293386+00', '2025-01-06 00:52:48.293386+00', NULL, 'ad412c44-1be3-4064-b455-f4936c489bbb'),
	('00000000-0000-0000-0000-000000000000', 97, 'Gm-9wIpYzk6U5ipkRlKRfQ', '3e11310a-844b-45b3-9902-363d5086ce0a', false, '2025-01-06 20:44:42.162195+00', '2025-01-06 20:44:42.162195+00', NULL, '0a560a81-ba55-49c9-816e-749e82c7d1fe'),
	('00000000-0000-0000-0000-000000000000', 98, '2lPJ6iSgojESxtEK0yim7w', '3e11310a-844b-45b3-9902-363d5086ce0a', false, '2025-01-06 20:44:44.729797+00', '2025-01-06 20:44:44.729797+00', NULL, '1c97a6a2-71fd-4c61-84a7-167a07d30d80'),
	('00000000-0000-0000-0000-000000000000', 100, 'ACSSyBx5kZIIq-g0bBwjXw', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', true, '2025-01-06 21:34:19.175865+00', '2025-01-06 22:34:29.162376+00', NULL, '92bd7bcc-6740-4cb2-bc03-17aa006d28e4'),
	('00000000-0000-0000-0000-000000000000', 102, 'STISCmFpJBT_IurRJGhf4w', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', true, '2025-01-06 22:34:29.163639+00', '2025-01-06 23:32:36.000569+00', 'ACSSyBx5kZIIq-g0bBwjXw', '92bd7bcc-6740-4cb2-bc03-17aa006d28e4');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "full_name", "email", "role", "position", "is_active", "created_at", "updated_at") VALUES
	('a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 'Adam Peterson', 'adampeterson@gmail.com', 'manager', 'Management', true, '2025-01-06 22:57:18.337932+00', '2025-01-06 22:57:18.337932+00'),
	('dd07b36f-1ae6-4716-8fa0-5cc77273c049', 'banana nana', 'banana@test.com', 'employee', 'Dispatcher', true, '2025-01-06 22:59:38.611815+00', '2025-01-06 22:59:38.611815+00'),
	('dc621601-d60f-4b3c-84c5-e21e3fb88d7b', 'jobby nobo', 'jobby@test.com', 'manager', 'Dispatcher', true, '2025-01-06 22:59:38.611815+00', '2025-01-06 22:59:38.611815+00'),
	('7b3e6eb8-8307-4678-98da-cbe3dc9be6bf', 'forge noop', 'fog@test.com', 'employee', 'Dispatcher', true, '2025-01-06 22:59:38.611815+00', '2025-01-06 22:59:38.611815+00'),
	('d7bd3ce1-84ce-47a4-a3e1-b6093e02fb48', 'jo jo', 'jojo@test.com', 'employee', 'Dispatcher', true, '2025-01-06 22:59:38.611815+00', '2025-01-06 22:59:38.611815+00'),
	('116b0084-1484-4693-82c7-1b978c7eb7ae', 'testerino', 'test@test.com', 'employee', 'Dispatcher', true, '2025-01-06 22:59:38.611815+00', '2025-01-06 22:59:38.611815+00'),
	('62b3ec35-88fb-426c-a1f6-adce91488ebe', 'boots bum', 'bootsbum@test.com', 'employee', 'Dispatcher', true, '2025-01-06 22:59:38.611815+00', '2025-01-06 22:59:38.611815+00'),
	('3e11310a-844b-45b3-9902-363d5086ce0a', 'davide', 'davide@test.com', 'employee', 'Shift Supervisor', true, '2025-01-06 22:59:38.611815+00', '2025-01-06 23:47:06.675598+00');


--
-- Data for Name: employee_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."employee_availability" ("id", "profile_id", "day_of_week", "start_time", "end_time", "created_at") VALUES
	('9e3f5332-0513-4055-ba51-75e392d1d58c', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 0, '09:00:00', '17:00:00', '2025-01-06 22:57:18.337932+00'),
	('db30d8d2-875e-42cd-bd6c-bf1775bbad15', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 1, '09:00:00', '17:00:00', '2025-01-06 22:57:18.337932+00'),
	('59486f3c-dbdb-4f92-9f23-79f9dd17e20b', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 2, '09:00:00', '17:00:00', '2025-01-06 22:57:18.337932+00'),
	('0f6ed8cd-4d22-4fa1-8d71-f4fb9e46fa07', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 3, '09:00:00', '17:00:00', '2025-01-06 22:57:18.337932+00'),
	('b1406faf-79eb-4b2a-b93b-060a3b4d352e', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 4, '09:00:00', '17:00:00', '2025-01-06 22:57:18.337932+00'),
	('c5a99cce-dadd-44dd-83ae-1404041a9d69', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 5, '09:00:00', '17:00:00', '2025-01-06 22:57:18.337932+00'),
	('8b041ccf-4fda-465a-92c1-9dde087bb765', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 6, '09:00:00', '17:00:00', '2025-01-06 22:57:18.337932+00');


--
-- Data for Name: shift_requirements; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."shift_requirements" ("id", "name", "day_of_week", "start_time", "end_time", "required_count", "created_at", "updated_at") VALUES
	('bc1bf4eb-2e09-4513-9336-fad6b00b1d8c', 'Day Shift Early (4 hours)', 0, '05:00:00', '09:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('4e7a0af9-2c1a-48e3-831e-039faeea2648', 'Day Shift Early (4 hours)', 1, '05:00:00', '09:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('a1f1b849-9d7b-4722-8415-d11e3cea6676', 'Day Shift Early (4 hours)', 2, '05:00:00', '09:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('4731a782-7d0f-4d24-8483-29aa850e0204', 'Day Shift Early (4 hours)', 3, '05:00:00', '09:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('bea23e2b-0208-45d3-8a5e-e7d436e63abf', 'Day Shift Early (4 hours)', 4, '05:00:00', '09:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('09d8a8d0-ce50-439b-94de-679e14fd1243', 'Day Shift Early (4 hours)', 5, '05:00:00', '09:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('3d6f5445-c855-47da-b595-598e98af377e', 'Day Shift Early (4 hours)', 6, '05:00:00', '09:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('4afb7195-24ff-4537-a20e-8af4e6be6642', 'Day Shift Early (10 hours)', 0, '05:00:00', '15:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('a5c7b9a3-80f0-4953-b7d5-45886924e4a8', 'Day Shift Early (10 hours)', 1, '05:00:00', '15:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('7dd31bcc-772e-4bad-af35-1ee075a395a9', 'Day Shift Early (10 hours)', 2, '05:00:00', '15:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('27be471b-3b9d-4d70-b0fc-176958833591', 'Day Shift Early (10 hours)', 3, '05:00:00', '15:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('0a5ee9de-552b-433c-9823-92f2fabf748f', 'Day Shift Early (10 hours)', 4, '05:00:00', '15:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('ddc98530-6857-4be1-8790-70526548ce22', 'Day Shift Early (10 hours)', 5, '05:00:00', '15:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('d6feb4e5-c6b4-485c-8f5b-7665af9cbcff', 'Day Shift Early (10 hours)', 6, '05:00:00', '15:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('f0d2bb64-e054-45f3-8c39-84ca4b3c3e51', 'Day Shift Early (12 hours)', 0, '05:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('67daf6c5-310d-4ea5-879d-14b5c88f73aa', 'Day Shift Early (12 hours)', 1, '05:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('3c4c11e9-5b40-44b7-abee-c097d76e4715', 'Day Shift Early (12 hours)', 2, '05:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('812b6eb3-aa0d-40fb-8b3a-c0b30b6995e1', 'Day Shift Early (12 hours)', 3, '05:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('a37890c9-4636-466a-9b96-3752b09edae2', 'Day Shift Early (12 hours)', 4, '05:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('7830cb36-85c2-4fee-af99-38631dc09117', 'Day Shift Early (12 hours)', 5, '05:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('cdec6e68-6f16-4b49-a6aa-d9fdf85737ce', 'Day Shift Early (12 hours)', 6, '05:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('7cc23fad-17a4-41eb-a44a-81de594f3b25', 'Day Shift (4 hours)', 0, '09:00:00', '13:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('fe81207f-87cc-4e5e-ba76-a98e751644a3', 'Day Shift (4 hours)', 1, '09:00:00', '13:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('c6f05aa4-a781-4428-8f19-ac4ce2bea648', 'Day Shift (4 hours)', 2, '09:00:00', '13:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('8914a10f-ed8a-4ace-b814-eda53c0656fe', 'Day Shift (4 hours)', 3, '09:00:00', '13:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('9995988b-be87-4bc9-911d-e7bc4e877e6b', 'Day Shift (4 hours)', 4, '09:00:00', '13:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('551606ab-1baa-4988-b79c-59e28d217b0a', 'Day Shift (4 hours)', 5, '09:00:00', '13:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('8c151714-531d-4e0d-8e37-73e955cbc4da', 'Day Shift (4 hours)', 6, '09:00:00', '13:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('67d9f536-ff69-47e7-abd3-5f3d13830919', 'Day Shift (10 hours)', 0, '09:00:00', '19:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('2dca7c60-ca85-4e15-97c2-c8bb8a46f91f', 'Day Shift (10 hours)', 1, '09:00:00', '19:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('7fdfc2a2-c164-4d66-a794-da3294195836', 'Day Shift (10 hours)', 2, '09:00:00', '19:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('2332e782-f8a4-4f59-8426-e90b61f05b42', 'Day Shift (10 hours)', 3, '09:00:00', '19:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('932ac817-f397-4860-907b-b7cc18492bf2', 'Day Shift (10 hours)', 4, '09:00:00', '19:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('3ae6e01b-8d64-440f-9483-0e6df09e67fd', 'Day Shift (10 hours)', 5, '09:00:00', '19:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('0211930f-d827-47f4-9c03-20a4f2bdd5af', 'Day Shift (10 hours)', 6, '09:00:00', '19:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('d13e82bb-eb22-4ad2-afe5-44e227c99dc0', 'Day Shift (12 hours)', 0, '09:00:00', '21:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('56cf9c34-8444-46d5-bc84-c468714a55e5', 'Day Shift (12 hours)', 1, '09:00:00', '21:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('497d86dc-8b63-47ae-b77b-10e3976981ba', 'Day Shift (12 hours)', 2, '09:00:00', '21:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('2c5cc5f0-b48f-4f69-9ef2-eb2c8744913e', 'Day Shift (12 hours)', 3, '09:00:00', '21:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('4dd4a368-288a-4b85-9dd7-7a3d64c347e6', 'Day Shift (12 hours)', 4, '09:00:00', '21:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('0748b088-97db-4a74-8eb7-9241e442e68d', 'Day Shift (12 hours)', 5, '09:00:00', '21:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('0ab5c89c-ffa6-41a7-8821-ffb7e0988c15', 'Day Shift (12 hours)', 6, '09:00:00', '21:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('c06d9d25-a1a9-41f4-aa5d-4e7749e7b397', 'Swing Shift (4 hours)', 0, '13:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('388e5469-7bac-427e-b06f-783aa9fbc864', 'Swing Shift (4 hours)', 1, '13:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('17baff1f-5864-464c-8816-2161bed9272b', 'Swing Shift (4 hours)', 2, '13:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('19d566dc-319c-4755-820b-90e497d8b924', 'Swing Shift (4 hours)', 3, '13:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('21470e74-44ed-4886-829d-4e5ba3987910', 'Swing Shift (4 hours)', 4, '13:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('e62a4556-7314-495c-88ce-3c4e26089280', 'Swing Shift (4 hours)', 5, '13:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('6c983f2a-770d-4fd6-afcc-5b79ae289a83', 'Swing Shift (4 hours)', 6, '13:00:00', '17:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('37cc1b62-0445-42f5-8a54-b16ffbd64506', 'Swing Shift (10 hours)', 0, '15:00:00', '01:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('e70b5464-3176-4c8c-b7ca-52e0313def84', 'Swing Shift (10 hours)', 1, '15:00:00', '01:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('06fcb19a-a21e-41dc-b871-90e877a9e6b5', 'Swing Shift (10 hours)', 2, '15:00:00', '01:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('29dca64e-e697-4c43-a61a-1a53abf1685a', 'Swing Shift (10 hours)', 3, '15:00:00', '01:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('0708ce62-eb07-4eab-8ae2-6603bd39092f', 'Swing Shift (10 hours)', 4, '15:00:00', '01:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('18d6fdbe-b162-4f7c-b75a-133add1d6204', 'Swing Shift (10 hours)', 5, '15:00:00', '01:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('aac5e095-148e-40a1-b305-61bd22afc88c', 'Swing Shift (10 hours)', 6, '15:00:00', '01:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('8852d49c-e573-4557-8c1f-296cc0cb95a0', 'Swing Shift (12 hours)', 0, '15:00:00', '03:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('aa9cc49b-007f-4125-ad34-7e95699ba093', 'Swing Shift (12 hours)', 1, '15:00:00', '03:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('0e518927-eff9-40fc-b311-497be45676da', 'Swing Shift (12 hours)', 2, '15:00:00', '03:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('0f61c742-8eb0-4469-84d2-6c1ab55f4e20', 'Swing Shift (12 hours)', 3, '15:00:00', '03:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('0a578cd3-368b-4b3f-8c69-2838c10637b3', 'Swing Shift (12 hours)', 4, '15:00:00', '03:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('8856a749-f867-46f8-bd35-a9c9a29103a3', 'Swing Shift (12 hours)', 5, '15:00:00', '03:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('da58a4c6-7360-4104-9e50-821e8ada1f57', 'Swing Shift (12 hours)', 6, '15:00:00', '03:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('90c2d8fc-dc53-4df9-a707-4816ee661039', 'Graveyards (4 hours)', 0, '01:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('1edf87a9-65f2-40c6-a6aa-7df13e6ccbd3', 'Graveyards (4 hours)', 1, '01:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('20097e17-c465-4edd-8af0-d6ec753426be', 'Graveyards (4 hours)', 2, '01:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('31ce90f9-a2f8-49de-8b92-78cae556a650', 'Graveyards (4 hours)', 3, '01:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('7922295f-f154-4bda-872d-cc382099ecab', 'Graveyards (4 hours)', 4, '01:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('bdc8db10-019d-488a-af04-556f407f16b3', 'Graveyards (4 hours)', 5, '01:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('b871ad9c-ab6b-4d32-9169-e71f849efc7d', 'Graveyards (4 hours)', 6, '01:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('4876c09e-60e8-4ca0-8ddf-34677bec422f', 'Graveyards (10 hours)', 0, '19:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('363ceefa-7571-4b51-98f4-361ca44fc72a', 'Graveyards (10 hours)', 1, '19:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('8c324107-ad71-4561-8a10-8fc688b0dd13', 'Graveyards (10 hours)', 2, '19:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('f7675a8e-5f67-439f-b310-cfc1adb6865f', 'Graveyards (10 hours)', 3, '19:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('1e7b6645-f91b-4d93-8756-bbf6eeb2ca01', 'Graveyards (10 hours)', 4, '19:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('9c8705f0-9816-48e2-858d-f0d6f5821732', 'Graveyards (10 hours)', 5, '19:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('dd16b4f7-9382-4528-a182-21868101e95a', 'Graveyards (10 hours)', 6, '19:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('3bc2e70f-8884-4047-8d07-7dc5285c2855', 'Graveyards (12 hours)', 0, '17:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('42ef2d43-7c32-4844-8f0c-ae1da75839a3', 'Graveyards (12 hours)', 1, '17:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('a7103628-0d0d-4dd3-9d50-fcf339e7cf43', 'Graveyards (12 hours)', 2, '17:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('0658d505-5310-425d-86da-f14ca8cc4a0d', 'Graveyards (12 hours)', 3, '17:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('b2ee564d-f6fa-43a6-b5fc-5308adcf436e', 'Graveyards (12 hours)', 4, '17:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('65f27d01-c84b-41b1-96fc-6adbd9a06383', 'Graveyards (12 hours)', 5, '17:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00'),
	('2d4ef5ef-f5e1-4bfb-b005-eb63e3604964', 'Graveyards (12 hours)', 6, '17:00:00', '05:00:00', 1, '2025-01-06 22:48:21.17724+00', '2025-01-06 22:48:21.17724+00');


--
-- Data for Name: shift_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."shift_assignments" ("id", "profile_id", "shift_requirement_id", "date", "start_time", "end_time", "created_at", "updated_at") VALUES
	('3543d278-4bb3-4b9c-be2e-2b6c19c696e1', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 'bc1bf4eb-2e09-4513-9336-fad6b00b1d8c', '2025-01-06', '05:00:00', '09:00:00', '2025-01-06 22:57:18.337932+00', '2025-01-06 22:57:18.337932+00'),
	('ef0792d9-ea93-4340-a307-c1d126c8550a', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', '4e7a0af9-2c1a-48e3-831e-039faeea2648', '2025-01-06', '05:00:00', '09:00:00', '2025-01-06 22:57:18.337932+00', '2025-01-06 22:57:18.337932+00'),
	('421d84f5-f6d2-4a0c-9def-7645902a4dfe', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 'a1f1b849-9d7b-4722-8415-d11e3cea6676', '2025-01-06', '05:00:00', '09:00:00', '2025-01-06 22:57:18.337932+00', '2025-01-06 22:57:18.337932+00'),
	('0d819a67-40f2-4f62-b78d-52c7dc851c29', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', '4731a782-7d0f-4d24-8483-29aa850e0204', '2025-01-06', '05:00:00', '09:00:00', '2025-01-06 22:57:18.337932+00', '2025-01-06 22:57:18.337932+00'),
	('f1d2cdc2-844e-4a7e-8cbe-90cd4da40a03', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 'bea23e2b-0208-45d3-8a5e-e7d436e63abf', '2025-01-06', '05:00:00', '09:00:00', '2025-01-06 22:57:18.337932+00', '2025-01-06 22:57:18.337932+00');


--
-- Data for Name: shifts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."shifts" ("id", "profile_id", "user_email", "shift_requirement_id", "date", "start_time", "end_time", "status", "notes", "created_at", "updated_at") VALUES
	('c7bc5455-bffd-4008-8d9c-484a6a299cdc', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 'adampeterson@gmail.com', 'bc1bf4eb-2e09-4513-9336-fad6b00b1d8c', '2025-01-06', '05:00:00', '09:00:00', 'accepted', NULL, '2025-01-06 22:57:18.337932+00', '2025-01-06 23:32:43.816033+00'),
	('1f83d1c6-fbf1-4552-9f91-b2dc24c1bb69', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 'adampeterson@gmail.com', '4e7a0af9-2c1a-48e3-831e-039faeea2648', '2025-01-06', '05:00:00', '09:00:00', 'accepted', NULL, '2025-01-06 22:57:18.337932+00', '2025-01-06 23:32:47.086049+00'),
	('d1aacf67-167e-4838-8460-24b1846c06e4', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 'adampeterson@gmail.com', 'a1f1b849-9d7b-4722-8415-d11e3cea6676', '2025-01-06', '05:00:00', '09:00:00', 'accepted', NULL, '2025-01-06 22:57:18.337932+00', '2025-01-06 23:32:48.099451+00'),
	('c1e4d356-99b9-4133-b9dc-1921f86abd47', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 'adampeterson@gmail.com', '4731a782-7d0f-4d24-8483-29aa850e0204', '2025-01-06', '05:00:00', '09:00:00', 'accepted', NULL, '2025-01-06 22:57:18.337932+00', '2025-01-06 23:32:49.31849+00'),
	('e67dacdc-1ef1-4649-a76b-92c0cf279e80', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', 'adampeterson@gmail.com', 'bea23e2b-0208-45d3-8a5e-e7d436e63abf', '2025-01-06', '05:00:00', '09:00:00', 'accepted', NULL, '2025-01-06 22:57:18.337932+00', '2025-01-06 23:32:50.211049+00');


--
-- Data for Name: time_off_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."time_off_requests" ("id", "profile_id", "start_date", "end_date", "reason", "status", "created_at", "updated_at") VALUES
	('2252851a-54db-4c92-b86f-490dacde78ab', 'a6b7e44b-52ff-4df4-9b8a-d6bfbfa66269', '2025-01-13', '2025-01-14', 'Vacation', 'pending', '2025-01-06 22:57:18.337932+00', '2025-01-06 22:57:18.337932+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 103, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
