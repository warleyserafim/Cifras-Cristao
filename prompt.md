Quero que você implemente uma funcionalidade que, ao receber um link de uma música do YouTube, execute os seguintes passos:

Captura de Áudio

Extrair o áudio da música diretamente do link do YouTube (utilizando youtube-dl ou yt-dlp).

Converter para um formato manipulável (ex.: .wav ou .mp3).

Reconhecimento de Acordes

Utilizar uma biblioteca de análise de áudio (ex.: essentia, librosa, madmom ou integração com a API do Chordify se disponível).

Identificar progressões de acordes ao longo da faixa, com marcação de tempo (timeline).

Sincronização da Letra

Tentar buscar automaticamente a letra via API de lyrics (Musixmatch, Genius API ou outra).

Sincronizar a letra com a linha do tempo dos acordes (se não houver sync disponível, exibir letra e acordes em paralelo).

Renderização no Frontend

Mostrar acordes acima da letra, no mesmo estilo do Cifras Club.

Criar player interativo com barra de progresso, mostrando onde o usuário está na música.

Permitir transposição de tom (subir/baixar meio tom).

Adicionar modo de rolagem automática.

Extra (Diferencial)

Opção de exportar cifra em PDF.

Opção de salvar nos favoritos do usuário.

Opção de praticar no modo karaokê (acordes mudando em tempo real).

O layout deve ser responsivo, inspirado no Cifras Club + Chordify:

Letras grandes e legíveis.

Acordes destacados em cor diferente.

Player fixo no topo para controlar a reprodução.