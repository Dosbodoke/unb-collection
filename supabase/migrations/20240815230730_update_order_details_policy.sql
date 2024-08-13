drop policy "Enable select for users based on user_id" on "public"."order_details";

drop policy "Enable update" on "public"."order_details";

create policy "Enable select for anon and authenticated users"
on "public"."order_details"
as permissive
for select
to anon, authenticated
using (true);


create policy "Enable update access for anon and authenticated users"
on "public"."order_details"
as permissive
for update
to anon, authenticated
using (true);



