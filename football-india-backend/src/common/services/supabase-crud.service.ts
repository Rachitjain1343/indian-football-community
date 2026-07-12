import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseCrudService {
  constructor(protected db: SupabaseClient, protected table: string) {}
  protected fail(error: { message: string } | null) { if (error) throw new InternalServerErrorException(error.message); }
  async findAll(query: Record<string, any> = {}) {
    const page = Math.max(Number(query.page) || 1, 1), limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    let request = this.db.from(this.table).select('*', { count: 'exact' });
    for (const [key, value] of Object.entries(query)) if (!['page','limit','search'].includes(key) && value !== undefined) request = request.eq(key, value);
    if (query.search) request = request.ilike('name', `%${query.search}%`);
    const { data, error, count } = await request.range((page - 1) * limit, page * limit - 1).order('created_at', { ascending: false }); this.fail(error);
    return { data, meta: { page, limit, total: count || 0, pages: Math.ceil((count || 0) / limit) } };
  }
  async findOne(id: string) { const { data, error } = await this.db.from(this.table).select('*').eq('id', id).maybeSingle(); this.fail(error); if (!data) throw new NotFoundException(`${this.table} record not found`); return data; }
  async create(payload: Record<string, any>) { const { data, error } = await this.db.from(this.table).insert(payload).select().single(); this.fail(error); return data; }
  async update(id: string, payload: Record<string, any>) { const { data, error } = await this.db.from(this.table).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().maybeSingle(); this.fail(error); if (!data) throw new NotFoundException(`${this.table} record not found`); return data; }
  async remove(id: string) { const { data, error } = await this.db.from(this.table).delete().eq('id', id).select('id').maybeSingle(); this.fail(error); if (!data) throw new NotFoundException(`${this.table} record not found`); return { deleted: true }; }
}
