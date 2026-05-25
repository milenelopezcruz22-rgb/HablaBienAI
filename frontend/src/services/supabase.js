import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function guardarSesion(sesion) {
  const { data, error } = await supabase
    .from('sesiones')
    .insert([sesion])
  if (error) console.error('Error guardando sesión:', error)
  return data
}

export async function obtenerSesiones() {
  const { data, error } = await supabase
    .from('sesiones')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) console.error('Error obteniendo sesiones:', error)
  return data ?? [] 
}