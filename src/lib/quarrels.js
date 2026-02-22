import { supabase } from './supabaseClient'

const ensureSupabase = () => {
  if (!supabase) throw new Error('Supabase 未配置')
  return supabase
}

export const listQuarrels = async ({ limit = 50 } = {}) => {
  const client = ensureSupabase()
  return client
    .from('quarrels')
    .select(
      'id, title, create_at, details, reason, opinion_male, opinion_female, is_principal, strength, tag, treatment, status, update_at, creator'
    )
    .order('create_at', { ascending: false })
    .limit(limit)
}

export const getQuarrelById = async (id) => {
  const client = ensureSupabase()
  return client
    .from('quarrels')
    .select(
      'id, title, create_at, details, reason, opinion_male, opinion_female, is_principal, strength, tag, treatment, status, update_at, creator'
    )
    .eq('id', id)
    .maybeSingle()
}

export const createQuarrel = async (payload) => {
  const client = ensureSupabase()
  return client
    .from('quarrels')
    .insert(payload)
    .select(
      'id, title, create_at, details, reason, opinion_male, opinion_female, is_principal, strength, tag, treatment, status, update_at, creator'
    )
    .single()
}

export const updateQuarrel = async (id, patch) => {
  const client = ensureSupabase()
  return client
    .from('quarrels')
    .update(patch)
    .eq('id', id)
    .select(
      'id, title, create_at, details, reason, opinion_male, opinion_female, is_principal, strength, tag, treatment, status, update_at, creator'
    )
    .single()
}

export const isQuarrelComplete = (row) => Boolean(row?.opinion_male?.trim() && row?.opinion_female?.trim())

export const getQuarrels = async () => {
  const client = ensureSupabase()
  const { data, error } = await client
    .from('quarrels')
    .select('*')
    .order('create_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const deleteQuarrel = async (id) => {
  const client = ensureSupabase()
  const { error } = await client
    .from('quarrels')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}