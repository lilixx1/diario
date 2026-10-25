
const formulario = document.getElementById("formularioDiario");
const campoTitulo = document.getElementById("titulo");
const campoData = document.getElementById("data");
const campoHumor = document.getElementById("humor");
const campoTexto = document.getElementById("texto");
const listaEntradas = document.getElementById("listaEntradas");
const mensagem = document.getElementById("mensagem");

const CHAVE_DIARIO = "meuDiarioSecreto";

let entradas = [];

try {
    const dadosSalvos = JSON.parse(
        localStorage.getItem(CHAVE_DIARIO)
    );

    if (Array.isArray(dadosSalvos)) {
        entradas = dadosSalvos.filter(function(entrada) {
            return entrada &&
                typeof entrada.id === "string" &&
                typeof entrada.titulo === "string" &&
                typeof entrada.data === "string" &&
                typeof entrada.humor === "string" &&
                typeof entrada.texto === "string";
        });
    }
} catch (erro) {
    entradas = [];
}

function obterDataHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

campoData.value = obterDataHoje();

function formatarData(data) {
    if (!data) {
        return "Data não informada";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function salvarEntradas() {
    try {
        localStorage.setItem(
            CHAVE_DIARIO,
            JSON.stringify(entradas)
        );

        return true;
    } catch (erro) {
        mensagem.textContent =
            "Não foi possível salvar. O armazenamento pode estar cheio.";

        return false;
    }
}

function mostrarEntradas() {
    listaEntradas.replaceChildren();

    if (entradas.length === 0) {
        const aviso = document.createElement("div");
        aviso.className = "vazio";
        aviso.textContent =
            "Suas lembranças aparecerão aqui. ♡";

        listaEntradas.appendChild(aviso);
        return;
    }

    const entradasOrdenadas = [...entradas].sort(function(a, b) {
        return b.data.localeCompare(a.data);
    });

    entradasOrdenadas.forEach(function(entrada) {
        const cartao = document.createElement("article");
        cartao.className = "entrada";

        const titulo = document.createElement("h3");
        titulo.textContent = entrada.titulo;

        const meta = document.createElement("div");
        meta.className = "entrada-meta";

        const data = document.createElement("span");
        data.textContent = `☾ ${formatarData(entrada.data)}`;

        const humor = document.createElement("span");
        humor.className = "etiqueta-humor";
        humor.textContent = entrada.humor;

        const texto = document.createElement("p");
        texto.className = "entrada-texto";
        texto.textContent = entrada.texto;

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.className = "botao-excluir";
        botaoExcluir.textContent = "Excluir lembrança";

        botaoExcluir.addEventListener("click", function() {
            const confirmar = confirm(
                "Tem certeza de que deseja excluir esta lembrança?"
            );

            if (!confirmar) {
                return;
            }

            entradas = entradas.filter(function(item) {
                return item.id !== entrada.id;
            });

            if (salvarEntradas()) {
                mostrarEntradas();
                mensagem.textContent = "Lembrança excluída.";
            }
        });

        meta.appendChild(data);
        meta.appendChild(humor);

        cartao.appendChild(titulo);
        cartao.appendChild(meta);
        cartao.appendChild(texto);
        cartao.appendChild(botaoExcluir);

        listaEntradas.appendChild(cartao);
    });
}

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const titulo = campoTitulo.value.trim();
    const data = campoData.value;
    const humor = campoHumor.value;
    const texto = campoTexto.value.trim();

    if (!titulo || !data || !humor || !texto) {
        mensagem.textContent =
            "Preencha todos os campos antes de guardar. ♡";
        return;
    }

    const novaEntrada = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        titulo: titulo,
        data: data,
        humor: humor,
        texto: texto
    };

    entradas.push(novaEntrada);

    if (salvarEntradas()) {
        formulario.reset();
        campoData.value = obterDataHoje();

        mostrarEntradas();

        mensagem.textContent =
            "Sua lembrança foi guardada com carinho. ♡";

        campoTitulo.focus();
    } else {
        entradas = entradas.filter(function(entrada) {
            return entrada.id !== novaEntrada.id;
        });
    }
});

mostrarEntradas();
