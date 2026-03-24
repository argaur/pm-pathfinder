-- Enable pgvector extension
create extension if not exists vector;

-- Document chunks for RAG pipeline
create table if not exists document_chunks (
  id          uuid primary key default gen_random_uuid(),
  content     text not null,
  embedding   vector(3072),
  source      text not null, -- 'archetype-content' | 'builders-bible'
  metadata    jsonb default '{}'::jsonb,
  created_at  timestamptz default now()
);

-- IVFFlat index for fast cosine similarity search
create index if not exists document_chunks_embedding_idx
  on document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 50);

-- RLS: only service role can read (API route uses service key)
alter table document_chunks enable row level security;

-- Match function used by the API route
create or replace function match_chunks(
  query_embedding vector(3072),
  match_count     int default 5,
  filter          jsonb default '{}'::jsonb
)
returns table (
  id       uuid,
  content  text,
  source   text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    dc.id,
    dc.content,
    dc.source,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks dc
  where
    case
      when filter->>'archetype' is not null
      then dc.source = 'builders-bible'
        or dc.metadata->>'archetype' = filter->>'archetype'
      else true
    end
  order by dc.embedding <=> query_embedding
  limit match_count;
end;
$$;
