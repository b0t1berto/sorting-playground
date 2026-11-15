# 🎨 Sorting Playground

Uma demonstração lúdica e interativa de algoritmos de ordenação. Veja barras de alturas diferentes se reorganizarem em tempo real, com cores por estado, sons que variam com a altura da barra e contadores de comparações e trocas.

## Estrutura

```
sorting-playground/
├── index.html
├── css/style.css
├── js/
│   ├── main.js          # interface, controles, áudio e loop de execução
│   ├── visualizer.js    # desenha as barras no canvas
│   └── algorithms/
│       ├── bubble.js
│       ├── selection.js
│       ├── insertion.js
│       ├── merge.js
│       └── quick.js
└── README.md
```

## Algoritmos incluídos

| Algoritmo | Arquivo | Complexidade (média) |
|-----------|---------|----------------------|
| Bubble Sort | `js/algorithms/bubble.js` | O(n²) |
| Selection Sort | `js/algorithms/selection.js` | O(n²) |
| Insertion Sort | `js/algorithms/insertion.js` | O(n²) |
| Merge Sort | `js/algorithms/merge.js` | O(n log n) |
| Quick Sort | `js/algorithms/quick.js` | O(n log n) |

## Controles

- **Algoritmo**: escolhe qual algoritmo visualizar
- **Tamanho do array**: quantidade de barras (10 a 200)
- **Velocidade**: atraso entre cada passo da animação
- **Novo Array**: gera um novo array aleatório e reseta os contadores
- **Iniciar / Pausar**: começa ou pausa a execução (também com a tecla Espaço)

## Toque lúdico

- **Cores por estado**:
  - 🔵 Azul: padrão / não tocado ainda
  - 🟡 Amarelo: comparando dois elementos
  - 🔴 Vermelho/rosa: trocando elementos de posição
  - 🟢 Verde: já ordenado / em posição final
- **Som**: cada ação emite um tom cuja frequência varia com a altura da barra
- **Contadores**: exibem o número total de comparações e trocas realizadas

## Como usar

1. Abra o `index.html` em qualquer navegador moderno.
2. Escolha o algoritmo, ajuste tamanho e velocidade.
3. Clique em **Novo Array** e depois em **Iniciar**.
4. Observe as barras se reorganizarem!

## Desenvolvido com

- HTML5 Canvas
- Web Audio API (sons)
- JavaScript (generators assíncronos para os algoritmos)

---

Divirta-se explorando a ordem surgindo do caos! 🚀