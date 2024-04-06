export default {
    props: {
        livros: Array,
    },
    setup(props, { emit }) {
        const autor = Vue.ref('')
        const preco = Vue.ref('')
        const nome = Vue.ref('')
        const id = Vue.ref('')
        const livroEditado = Vue.ref({});
        const livros = Vue.ref(props.livros || [])
        function inserir() {
            if (livroEditado.value.id) {
                (async () => {
                    let id = await alterar(livroEditado.value)
                    alert('Registro #' + id + ' alterado!')
                    emit('refresh')
                })()
            } else {
                (async () => {
                    let id = await adicionar({ nome: livroEditado.value.nome, autor: livroEditado.value.autor, preco: livroEditado.value.preco })
                    alert('Registro #' + id + ' adicionado!')
                    emit('refresh')
                })()
            }

        }
        function selecionar(livro) {
            // emit('selecionado', livro);
            this.$router.push('/detalhes/' + livro.id);
        }
        function editar(livro) {
            livroEditado.value = livro;
        }
        async function apagar(id) {
            if (confirm('Quer apagar o #' + id + '?')) {
                console.log('apagado', await deletar(id));
            }
            emit('refresh')
        }
        return {
            livros,
            nome,
            autor,
            preco,
            id,
            livroEditado,
            inserir,
            editar,
            selecionar,
            apagar
        }
    },
    template: `
    <div class="row justify-content-center my-5">
        <div class="col">
            <form method="POST" @submit.prevent="inserir" class="form">
                <label for="nome" class="form-label">Título:</label>
                <div class="input-group mb-4">
                    <span class="input-group-text">
                    <i class="bi bi-envelope-fill text-secondary"></i>
                    </span>
                    <input type="text" name="nome" v-model="livroEditado.nome" id="nome" class="form-control"
                    placeholder="Título do livro" required />
                </div>
                <label for="autor" class="form-label">Autor:</label>
                <div class="mb-4 input-group">
                    <span class="input-group-text">
                    <i class="bi bi-person-fill text-secondary"></i>
                    </span>
                    <input type="text" name="autor" v-model="livroEditado.autor" id="autor" class="form-control"
                    placeholder="Exemplo: Mario Quintana" required />
                </div>                      
                <label for="preco" class="form-label">Preco:</label>
                <div class="mb-4 input-group">
                    <span class="input-group-text">
                    <i class="bi bi-person-fill text-secondary"></i>
                    </span>
                    <input type="number" name="preco" v-model="livroEditado.preco" id="preco" step="0.01" class="form-control" required />
                </div>
                <div class="mb-4 text-center">
                    <button type="submit" class="btn btn-secondary">Enviar</button>
                </div>
            </form>
        </div>
        <div class="col">
            <table>
                <tr>
                    <th class="px-3">Id</th>
                    <th class="px-3">Nome</th>
                    <th class="px-3">Autor</th>
                    <th class="px-3">Preco</th>
                </tr>
                <tbody>
                    <tr v-for="livro of livros" :style="{ color: livro.preco > 50 ? 'red' : 'green' }">
                        <td>{{livro.id}}</td>
                        <td>{{livro.nome}}</td>
                        <td>{{livro.autor}}</td>
                        <td>{{livro.preco}}</td>
                        <button @click="selecionar(livro);">Selecionar</button>
                        <button @click="editar(livro);">Editar</button>
                        <button @click="apagar(livro.id);">Apagar</button>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `
}