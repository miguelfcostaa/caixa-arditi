# Fotografias da Equipa — Efeito Pop-Out (Estilo Atlassian)

O design da equipa utiliza o efeito **Pop-Out**, onde a pessoa "sai para fora" do bloco de cor (a cabeça sobressai no topo).

---

### Como devem ser preparadas as fotografias:
1. **Fundo Transparente (Cutout / Recorte)**:
   - O ficheiro deve ser **PNG** ou **WebP** com fundo transparente.
   - Ferramentas gratuitas para remover o fundo com 1 clique:
     - [remove.bg](https://www.remove.bg)
     - Photoshop (Quick Selection / Remove Background)
     - Canva (Background Remover)
     - iOS / macOS (clicar e manter premido o sujeito na fotografia e escolher "Copiar Sujeito")
2. **Enquadramento Recomendado**:
   - Plano aproximado do peito/cintura para cima (busto/retrato).
   - A base da foto (tronco) deve terminar plana na margem inferior para assentar perfeitamente na base do cartão.
   - Resolução sugerida: `500x600px` ou `600x720px` (proporção ~4:5 ou ~1:1.2).

---

### Mapeamento dos Ficheiros em `components/Team.tsx`:

1. **Investigação & Coordenação**:
   - `public/team/ana-lucia-faria.png` ➔ `image: "/team/ana-lucia-faria.png"`
   - `public/team/luis-ferreira.png` ➔ `image: "/team/luis-ferreira.png"`
   - `public/team/monica-cameirao.png` ➔ `image: "/team/monica-cameirao.png"`

2. **Psicologia**:
   - `public/team/petra-santos.png` ➔ `image: "/team/petra-santos.png"`
   - `public/team/beatriz-castro.png` ➔ `image: "/team/beatriz-castro.png"`

3. **Desenvolvimento de Software**:
   - `public/team/miguel-costa.png` ➔ `image: "/team/miguel-costa.png"` *(já inclui o exemplo ativo `sample-popout.svg` para demonstração imediata)*
   - `public/team/roberto-fernandes.png` ➔ `image: "/team/roberto-fernandes.png"`

4. **Design**:
   - `public/team/juan-ponte.png` ➔ `image: "/team/juan-ponte.png"`
   - `public/team/carolina-luis.png` ➔ `image: "/team/carolina-luis.png"`

---

### Fallback Automático:
- Enquanto o campo `image` estiver vazio (`""`) ou o ficheiro não estiver disponível, o cartão apresenta o fundo colorido com as iniciais estilizadas em branco, garantindo que o layout nunca quebra.
- O componente possui um seletor no topo da secção que permite alternar entre o formato **Quadrado** (referência Atlassian) e **Círculo** (pop-out circular).
