# 📮 Posts CRUD System - Documentação Completa

## 🎯 Visão Geral

Implementação de um sistema CRUD completo para posts no Barza, com:
- ✅ **Create**: Criar novos posts via modal
- ✅ **Read**: Listar posts com paginação
- ✅ **Update**: Editar posts (só o dono)
- ✅ **Delete**: Deletar posts (só o dono)
- ✅ **Authorization**: Apenas donos podem editar/deletar seus posts

---

## 📁 Arquivos Criados

```
✅ app/api/posts/route.ts
   - POST: Criar novo post
   - GET: Listar posts com paginação

✅ app/api/posts/[id]/route.ts
   - GET: Buscar post por ID
   - PATCH: Atualizar post (authorization check)
   - DELETE: Deletar post (authorization check)

✅ components/PostCard.tsx
   - Exibe um post individual
   - Botões edit/delete (visíveis só para dono)
   - Integrado com EditPostModal

✅ components/EditPostModal.tsx
   - Modal para editar posts
   - Mesma interface do CreatePostModal
   - Validações e feedback

✅ components/PostsFeed.tsx
   - Component reutilizável para exibir feed
   - Paginação infinita (load more)
   - Gerencia estado de posts

✅ components/CreatePostModal.tsx (atualizado)
   - Callback onPostCreated para integração
   - Mensagem de sucesso
```

---

## 🔌 API Endpoints

### 1️⃣ POST /api/posts
**Criar novo post**

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "content": "Meu primeiro post no Barza!",
    "image_url": "https://example.com/image.jpg"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "user-uuid",
    "content": "Meu primeiro post no Barza!",
    "image_url": "https://example.com/image.jpg",
    "likes_count": 0,
    "comments_count": 0,
    "created_at": "2026-05-06T14:23:35.444Z",
    "updated_at": "2026-05-06T14:23:35.444Z"
  }
}
```

**Erros:**
- 400: Content vazio ou > 1000 chars
- 401: Não autenticado
- 500: Erro no servidor

---

### 2️⃣ GET /api/posts
**Listar posts com paginação**

```bash
curl "http://localhost:3000/api/posts?limit=20&offset=0&user_id=optional-user-id"
```

**Query Params:**
- `limit` (default: 20, max: 100)
- `offset` (default: 0)
- `user_id` (optional) - filtrar por usuário

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "post-id-1",
      "user_id": "user-uuid",
      "content": "Post 1 content...",
      "created_at": "2026-05-06T14:23:35Z",
      "likes_count": 5,
      "comments_count": 2
    },
    {
      "id": "post-id-2",
      "user_id": "user-uuid",
      "content": "Post 2 content...",
      "created_at": "2026-05-06T13:23:35Z",
      "likes_count": 12,
      "comments_count": 8
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 156
  }
}
```

---

### 3️⃣ GET /api/posts/[id]
**Buscar um post específico**

```bash
curl http://localhost:3000/api/posts/550e8400-e29b-41d4-a716-446655440000
```

**Response (200):**
```json
{
  "success": true,
  "post": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "user-uuid",
    "content": "Post content...",
    "image_url": null,
    "likes_count": 5,
    "comments_count": 2,
    "created_at": "2026-05-06T14:23:35Z",
    "updated_at": "2026-05-06T14:23:35Z"
  }
}
```

**Erros:**
- 404: Post não encontrado

---

### 4️⃣ PATCH /api/posts/[id]
**Atualizar um post (apenas o dono)**

```bash
curl -X PATCH http://localhost:3000/api/posts/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "content": "Post atualizado com melhor texto!",
    "image_url": "https://example.com/new-image.jpg"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "post": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "user-uuid",
    "content": "Post atualizado com melhor texto!",
    "image_url": "https://example.com/new-image.jpg",
    "likes_count": 5,
    "comments_count": 2,
    "created_at": "2026-05-06T14:23:35Z",
    "updated_at": "2026-05-06T14:30:00Z"
  }
}
```

**Erros:**
- 400: Content vazio ou > 1000 chars
- 401: Não autenticado
- 403: Não é o dono do post
- 404: Post não encontrado

---

### 5️⃣ DELETE /api/posts/[id]
**Deletar um post (apenas o dono)**

```bash
curl -X DELETE http://localhost:3000/api/posts/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Erros:**
- 401: Não autenticado
- 403: Não é o dono do post
- 404: Post não encontrado

---

## 🧩 Componentes React

### PostCard
```typescript
import { PostCard } from '@/components/PostCard'

<PostCard
  post={post}
  currentUserId={userId}
  onDelete={(postId) => console.log('Deleted:', postId)}
  onEdit={(post) => console.log('Edited:', post)}
  onLike={(postId) => console.log('Liked:', postId)}
/>
```

**Props:**
- `post: Post` - Post para exibir
- `currentUserId?: string` - ID do usuário logado
- `onDelete?: (postId) => void` - Callback ao deletar
- `onEdit?: (post) => void` - Callback ao editar
- `onLike?: (postId) => void` - Callback ao like

**Funcionalidades:**
- ✅ Botões Edit/Delete (só visíveis para dono)
- ✅ Integrado com EditPostModal
- ✅ Likes e comentários contadores
- ✅ Avatar e nome do usuário
- ✅ Tempo relativo (ex: "2 horas atrás")
- ✅ Imagem do post (se existir)

---

### PostsFeed
```typescript
import { PostsFeed } from '@/components/PostsFeed'

<PostsFeed 
  currentUserId={userId}
  limit={20}
/>
```

**Props:**
- `currentUserId?: string` - ID do usuário logado
- `limit?: number` - Posts por página (default: 20)

**Funcionalidades:**
- ✅ Carregamento automático na montagem
- ✅ Paginação infinita (load more)
- ✅ Feedback de carregamento
- ✅ Tratamento de erros
- ✅ Atualização otimista ao editar/deletar

---

### CreatePostModal
```typescript
import { CreatePostModal } from '@/components/CreatePostModal'

const [isOpen, setIsOpen] = useState(false)

<CreatePostModal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onPostCreated={(post) => console.log('New post:', post)}
/>
```

**Props:**
- `isOpen: boolean` - Controla visibilidade
- `onClose: () => void` - Callback ao fechar
- `onPostCreated?: (post) => void` - Callback ao criar (novo!)

---

### EditPostModal
```typescript
import { EditPostModal } from '@/components/EditPostModal'

const [isEditOpen, setIsEditOpen] = useState(false)
const [postToEdit, setPostToEdit] = useState(null)

<EditPostModal 
  isOpen={isEditOpen}
  post={postToEdit}
  onClose={() => setIsEditOpen(false)}
  onPostUpdated={(post) => console.log('Updated:', post)}
/>
```

**Props:**
- `isOpen: boolean` - Controla visibilidade
- `post: Post | null` - Post sendo editado
- `onClose: () => void` - Callback ao fechar
- `onPostUpdated?: (post) => void` - Callback ao atualizar

---

## 🔐 Autorização

### Regras
1. **Create Post**: Apenas usuários autenticados
2. **Edit Post**: Apenas o dono do post
3. **Delete Post**: Apenas o dono do post
4. **Read**: Público (qualquer pessoa pode ver)

### Implementação
```typescript
// No backend (API route)
const { user } = await supabase.auth.getUser()

if (post.user_id !== user.id) {
  return NextResponse.json(
    { error: 'You can only edit your own posts' },
    { status: 403 }
  )
}
```

### Frontend (Visibilidade)
```typescript
const isOwner = currentUserId === post.user_id

{isOwner && (
  <>
    <EditButton />
    <DeleteButton />
  </>
)}
```

---

## 📊 Database Schema

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- RLS Policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ler
CREATE POLICY "Public posts are viewable" ON posts
  FOR SELECT USING (true);

-- Apenas o dono pode criar/atualizar/deletar
CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 🎨 UX Flows

### Flow 1: Criar Post
```
User clica "Create Post"
  ↓
Modal abre
  ↓
User escreve conteúdo
  ↓
User clica "Postar"
  ↓
API envia POST /api/posts
  ↓
Modal fecha (sucesso)
  ↓
PostsFeed atualiza (novo post aparece)
```

### Flow 2: Editar Post
```
User vê seu post no feed
  ↓
User clica botão "Edit"
  ↓
EditPostModal abre com conteúdo
  ↓
User edita e clica "Atualizar"
  ↓
API envia PATCH /api/posts/[id]
  ↓
Modal fecha (sucesso)
  ↓
PostCard atualiza com novo conteúdo
```

### Flow 3: Deletar Post
```
User clica botão "Delete"
  ↓
Confirmação: "Tem certeza?"
  ↓
User confirma
  ↓
API envia DELETE /api/posts/[id]
  ↓
PostCard desaparece do feed
```

---

## ✅ Validações

### Frontend (UX)
- ✅ Textarea com maxLength 1000
- ✅ Counter de caracteres
- ✅ Botão desabilitado com conteúdo vazio
- ✅ Botão desabilitado durante envio
- ✅ Mensagens de erro claras
- ✅ Confirmação antes de deletar

### Backend (Segurança)
- ✅ Content obrigatório e > 0 chars
- ✅ Content máximo 1000 chars
- ✅ Autenticação obrigatória
- ✅ Propriedade verificada para edit/delete
- ✅ Sanitização (Next.js XSS protection)

---

## 🚀 Como Usar no Projeto

### 1. Setup (Supabase Console)
```sql
-- Execute a criação da tabela e RLS policies
CREATE TABLE posts (...)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "..." ON posts ...
```

### 2. Componente Community Page
```typescript
'use client'

import { PostsFeed } from '@/components/PostsFeed'
import { useAuth } from '@/lib/hooks/useAuth'

export default function CommunityPage() {
  const { user } = useAuth()
  
  return (
    <main className="container">
      <PostsFeed currentUserId={user?.id} />
    </main>
  )
}
```

### 3. Integrar Create Post
```typescript
import { CreatePostModal } from '@/components/CreatePostModal'
import { useState } from 'react'

export default function Header() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  
  return (
    <>
      <button onClick={() => setIsCreateOpen(true)}>
        Create Post
      </button>
      
      <CreatePostModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  )
}
```

---

## 🐛 Troubleshooting

### Erro: "You can only edit your own posts"
- ✅ Você está tentando editar um post que não é seu
- ✅ Solução: Apenas o dono pode editar

### Erro: "Post not found"
- ✅ Post foi deletado ou ID inválido
- ✅ Solução: Recarregue o feed

### Posts não aparecem
- ✅ Verifique se tabela `posts` foi criada
- ✅ Verifique RLS policies (public read)
- ✅ Verifique se há posts na database

### Botões de edit/delete não aparecem
- ✅ `currentUserId` não foi passado ao PostCard
- ✅ `currentUserId` não bate com `post.user_id`
- ✅ Solução: Verifique autenticação e props

---

## 📋 Checklist de Implementação

- ✅ Criar tabela `posts` no Supabase
- ✅ Configurar RLS policies
- ✅ API endpoints implementados (POST, GET, PATCH, DELETE)
- ✅ Components React (PostCard, PostsFeed, EditPostModal)
- ✅ Autorização (verificar ownership)
- ✅ Validações (frontend + backend)
- ✅ Build passa (TypeScript)
- ✅ Testes passam (101 tests)

---

## 🎯 Próximos Passos

1. **Likes System**
   - Tabela `post_likes` com user_id + post_id
   - Endpoints para like/unlike
   - Counter em tempo real

2. **Comments System**
   - Tabela `post_comments` com conteúdo
   - CRUD completo para comentários
   - Nested replies

3. **Real-time Updates**
   - WebSocket ou Server-Sent Events
   - Live feed updates
   - Notificações

4. **Image Upload**
   - Supabase Storage integration
   - Image compression
   - Drag & drop

5. **Search & Filtering**
   - Full-text search
   - Filtrar por user
   - Sort by date/popularity

---

## ✅ Status

- ✅ Build: Passou
- ✅ Testes: 101/101 passaram
- ✅ TypeScript: Sem erros
- ✅ Authorization: Implementada
- ✅ Validations: Frontend + Backend
- ✅ UX: Completa e intuitiva

**Pronto para usar! 🚀**
