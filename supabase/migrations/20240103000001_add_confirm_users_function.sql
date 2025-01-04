-- Create function to confirm users by email
create or replace function auth.confirm_users(user_emails text[])
returns void
language plpgsql
security definer
set search_path = auth, public
as $$
begin
  -- Update users to confirmed status
  update auth.users
  set email_confirmed_at = now(),
      confirmed_at = now(),
      updated_at = now(),
      raw_app_meta_data = raw_app_meta_data || 
        jsonb_build_object('email_confirmed', true)
  where email = any(user_emails);
end;
$$; 