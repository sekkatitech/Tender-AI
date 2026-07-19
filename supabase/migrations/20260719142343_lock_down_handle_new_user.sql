-- handle_new_user is invoked only by the on_auth_user_created trigger —
-- unlike get_my_company_id(), no client role should ever call it directly.
-- Revoking from PUBLIC alone wasn't enough (anon/authenticated had their own
-- default-privilege grants), so revoke explicitly from both.
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;
