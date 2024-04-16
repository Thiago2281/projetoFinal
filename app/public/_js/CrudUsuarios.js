export default {
    props: {
        usuarios: Array,
    },
    setup(props, { emit }) {
        const senha = Vue.ref('')
        const papel = Vue.ref('')
        const nome = Vue.ref('')
        const id = Vue.ref('')
        const usuarioEditado = Vue.ref({});
        const usuarios = Vue.ref(props.usuarios || [])
        function inserir() {
            if (usuarioEditado.value.id) {
                (async () => {
                    let id = await alterar(usuarioEditado.value)
                    alert('Registro #' + id + ' alterado!')
                    emit('refresh')
                })()
            } else {
                (async () => {
                    let id = await adicionar({ nome: usuarioEditado.value.nome, senha: usuarioEditado.value.senha, papel: usuarioEditado.value.papel })
                    alert('Registro #' + id + ' adicionado!')
                    emit('refresh')
                })()
            }

        }
        function selecionar(usuario) {
            // emit('selecionado', usuario);
            this.$router.push('/detalhes/' + usuario.id);
        }
        function editar(usuario) {
            usuarioEditado.value = usuario;
        }
        async function apagar(id) {
            if (confirm('Quer apagar o #' + id + '?')) {
                console.log('apagado', await deletar(id));
            }
            emit('refresh')
        }
        return {
            usuarios,
            nome,
            senha,
            papel,
            id,
            usuarioEditado,
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
                <label for="nome" class="form-label">Nome:</label>
                <div class="input-group mb-4">
                    <span class="input-group-text">
                    <i class="bi bi-envelope-fill text-secondary"></i>
                    </span>
                    <input type="text" name="nome" v-model="usuarioEditado.nome" id="nome" class="form-control" required />
                </div>
                <label for="senha" class="form-label">Senha:</label>
                <div class="mb-4 input-group">
                    <span class="input-group-text">
                    <i class="bi bi-person-fill text-secondary"></i>
                    </span>
                    <input type="text" name="senha" v-model="usuarioEditado.senha" id="senha" class="form-control" required />
                </div>                      
                <label for="papel" class="form-label">Papel:</label>
                <div class="mb-4 input-group">
                    <span class="input-group-text">
                    <i class="bi bi-person-fill text-secondary"></i>
                    </span>
                    <input type="number" name="papel" v-model="usuarioEditado.papel_id" id="papel" class="form-control" required />
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
                    <th class="px-3">Senha</th>
                    <th class="px-3">Papel</th>
                </tr>
                <tbody>
                    <tr v-for="usuario of usuarios" :style="{ color: usuario.papel > 50 ? 'red' : 'green' }">
                        <td>{{usuario.id}}</td>
                        <td>{{usuario.nome}}</td>
                        <td>{{usuario.senha}}</td>
                        <td>{{usuario.papel_id}}</td>
                        <button @click="selecionar(usuario);">Selecionar</button>
                        <button @click="editar(usuario);">Editar</button>
                        <button @click="apagar(usuario.id);">Apagar</button>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `
}