# 🎨 Sorting Playground

Uma demonstração lúdica e interativa de algoritmos de ordenação. Veja barras de alturas diferentes se reorganizarem em tempo real, com cores por estado, sons que variam com a altura da barra, contadores de comparações e trocas, modo corrida entre dois algoritmos e animação de vitória.

---

## 📸 Demonstração

🔗 **Demo online:** [https://b0t1berto.github.io/sorting-playground](https://b0t1berto.github.io/sorting-playground)  
*(Ative o GitHub Pages no repositório para publicar a demo automaticamente.)*

---

## 🚀 Como rodar localmente

Não é necessário instalar dependências. Basta abrir o arquivo `index.html` em qualquer navegador moderno:

```bash
# Abra diretamente no navegador
open index.html

# Ou sirva com um servidor local (recomendado para o áudio funcionar corretamente)
python3 -m http.server 8000
# Depois acesse: http://localhost:8000
```

> 💡 **Dica:** Alguns navegadores bloqueiam a Web Audio API em arquivos abertos diretamente (`file://`). Se os sons não funcionarem, sirva o projeto com um servidor local como acima.

---

## 🎮 Controles

| Controle | Descrição |
|----------|-----------|
| **Algoritmo** | Escolhe qual algoritmo visualizar (select) |
| **Algoritmo 2** | Escolhe o segundo algoritmo para o modo corrida |
| **Tamanho** | Quantidade de barras (10 a 200) |
| **Velocidade** | Atraso entre cada passo da animação (sleep) |
| **🔄 Novo Array** | Gera um novo array aleatório e reseta os contadores |
| **▶️ Iniciar / ⏸️ Pausar** | Começa ou pausa a execução (também com a tecla Espaço) |
| **🏁 Corrida** | Executa dois algoritmos lado a lado no mesmo array e anuncia o vencedor |
| **⏹️ Parar Corrida** | Interrompe a corrida em andamento |

---

## 🎨 Toque lúdico

- **Cores por estado:**
  - 🔵 Azul: padrão / não tocado ainda
  - 🟡 Amarelo: comparando dois elementos
  - 🔴 Vermelho/rosa: trocando elementos de posição
  - 🟢 Verde: já ordenado / em posição final

- **Sons:** Cada ação emite um tom cuja frequência varia com a altura da barra (Web Audio API + OscillatorNode).

- **Animação de vitória:** Uma varredura verde percorre as barras da esquerda para a direita quando a ordenação termina.

- **Modo corrida:** Dois algoritmos executam lado a lado no mesmo array. O primeiro a terminar é anunciado como vencedor (🏆 Vencedor: Algoritmo A/B).

- **Contadores:** Exibem o número total de comparações e trocas realizadas.

---

## 📊 Algoritmos incluídos

| Algoritmo | Arquivo | Complexidade média | Complexidade pior caso | Descrição |
|-----------|---------|-------------------|----------------------|-----------|
| Bubble Sort | `js/algorithms/bubble.js` | O(n²) | O(n²) | Percorre o array comparando adjacentes e troca se estiverem fora de ordem. |
| Selection Sort | `js/algorithms/selection.js` | O(n²) | O(n²) | Encontra o menor elemento do restante não ordenado e coloca na posição correta. |
| Insertion Sort | `js/algorithms/insertion.js` | O(n²) | O(n²) | Constrói a parte ordenada um elemento por vez, inserindo cada item na posição certa. |
| Merge Sort | `js/algorithms/merge.js` | O(n log n) | O(n log n) | Divide o array ao meio recursivamente e mescla as metades ordenadas. |
| Quick Sort | `js/algorithms/quick.js` | O(n log n) | O(n²) | Escolhe um pivô, particiona o array e ordena recursivamente as partes. |

---

## 🛠️ Como contribuir com um novo algoritmo

1. **Crie o arquivo do algoritmo** em `js/algorithms/seuAlgoritmo.js`:

   Exemplo usando generator (`function*`):

   ```javascript
   /** 
    * Nome do Algoritmo - descrição curta de uma linha.
    */
   function* seuAlgoritmo(array) {
       // Sua lógica aqui
       // Use `yield { type: 'compare', indices: [i, j] }` para comparações
       // Use `yield { type: 'swap', indices: [i, j] }` para trocas
       // Use `yield { type: 'sorted', indices: [i] }` para marcar posição final
       // Use `yield { type: 'done' }` no final
       yield { type: 'done' };
   }

   window.seuAlgoritmo = seuAlgoritmo;
   ```

   Tipos de passo suportados:
   - `compare`: compara dois elementos (🟡 amarelo)
   - `swap`: troca dois elementos de posição (🔴 vermelho)
   - `overwrite`: sobrescreve um elemento (🔴 vermelho)
   - `sorted`: marca elemento como ordenado (🟢 verde)
   - `done`: sinaliza fim da ordenação

2. **Registre no `js/main.js`:**

   - Adicione ao `algorithmMap`:
     ```javascript
     seualgoritmo: window.seuAlgoritmo,
     ```
   - Adicione ao `algorithmInfo` (para o painel de informações):
     ```javascript
     seualgoritmo: {
         name: 'Nome do Algoritmo',
         complexity: 'O(n log n)',
         desc: 'Descrição de uma linha do algoritmo.'
     },
     ```

3. **Adicione a opção no `<select>` do `index.html`:**

   ```html
   <option value="seualgoritmo">Nome do Algoritmo</option>
   ```

   Faça isso tanto no `#algorithm` quanto no `#algorithm2`.

4. **Atualize o README:** inclua o novo algoritmo na tabela acima.

5. Envie um Pull Request com suas mudanças.

---

## 🏗️ Estrutura do projeto

```text
sorting-playground/
├── index.html
├── css/style.css
├── js/
│   ├── main.js          # interface, controles, áudio, modo corrida, painel info
│   ├── visualizer.js    # desenha barras, consome geradores, controle de cor
│   └── algorithms/
│       ├── bubble.js
│       ├── selection.js
│       ├── insertion.js
│       ├── merge.js
│       └── quick.js
└── README.md
```

---

## 🛠️ Desenvolvido com

- HTML5
- CSS3 (variáveis CSS, grid, animações keyframes)
- JavaScript (generators assíncronos, async/await)
- Web Audio API (sons)

---

Feito com ❤️ para visualizar a ordem surgindo do caos. Divirta-se! 🚀
