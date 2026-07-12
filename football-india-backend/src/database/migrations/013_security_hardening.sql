do $$ declare t text; begin
  foreach t in array array['fan_profiles','clubs','national_teams','players','leaderboard','blog_topics','blogs','comments','likes','product_categories','products','cart_items','orders','order_items','payments','notifications'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon, authenticated', t);
    execute format('grant all on table public.%I to service_role', t);
  end loop;
end $$;

revoke all on function public.create_order_from_cart(text,jsonb) from public, anon, authenticated;
revoke all on function public.mark_order_paid(text,text,text,text) from public, anon, authenticated;
revoke all on function public.increment_blog_views(uuid) from public, anon, authenticated;
grant execute on function public.create_order_from_cart(text,jsonb) to service_role;
grant execute on function public.mark_order_paid(text,text,text,text) to service_role;
grant execute on function public.increment_blog_views(uuid) to service_role;

create or replace function public.mark_order_paid(p_user_id text,p_gateway_order_id text,p_gateway_payment_id text,p_signature text) returns jsonb language plpgsql security definer set search_path=public as $$
declare v_payment public.payments;
begin
  select * into v_payment from public.payments where gateway_order_id=p_gateway_order_id and user_id=p_user_id for update;
  if v_payment.id is null then raise exception 'Payment not found'; end if;
  if v_payment.status='paid' then return jsonb_build_object('verified',true,'orderId',v_payment.order_id,'duplicate',true); end if;
  update public.payments set gateway_payment_id=p_gateway_payment_id,signature=p_signature,status='paid',updated_at=now() where id=v_payment.id;
  update public.orders set payment_status='paid',status='confirmed',updated_at=now() where id=v_payment.order_id and payment_status<>'paid';
  insert into public.notifications(user_id,type,title,message,data) values(p_user_id,'order','Payment successful','Your order has been confirmed',jsonb_build_object('orderId',v_payment.order_id));
  return jsonb_build_object('verified',true,'orderId',v_payment.order_id,'duplicate',false);
end $$;
revoke all on function public.mark_order_paid(text,text,text,text) from public, anon, authenticated;
grant execute on function public.mark_order_paid(text,text,text,text) to service_role;
