export default {
    props: {
        eventos: Array,
    },
    setup(props, { emit }) {
        const lado = Vue.ref('')
        const area = Vue.ref('')
        const nome = Vue.ref('')
        const id = Vue.ref('')
        const eventoEditado = Vue.ref({});
        const eventos = Vue.ref(props.eventos || [])
        function inserir() {
            if (eventoEditado.value.id) {
                (async () => {
                    let id = await alterarEventos(eventoEditado.value)
                    alert('Registro #' + id + ' alterado!')
                    emit('refresh')
                })()
            } else {
                (async () => {
                    let id = await adicionarEventos({ nome: eventoEditado.value.nome, lado: eventoEditado.value.lado, area: eventoEditado.value.area })
                    alert('Registro #' + id + ' adicionado!')
                    emit('refresh')
                })()
            }

        }
        function selecionar(evento) {
            // emit('selecionado', evento);
            this.$router.push('/detalheseventos/' + evento.id);
        }
        function editar(evento) {
            eventoEditado.value = evento;
        }
        async function apagar(id) {
            if (confirm('Quer apagar o #' + id + '?')) {
                console.log('apagado', await deletarEventos(id));
            }
            emit('refresh')
        }
        return {
            eventos,
            nome,
            lado,
            area,
            id,
            eventoEditado,
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
                    <input type="text" name="nome" v-model="eventoEditado.nome" id="nome" class="form-control" required />
                </div>
                <label for="lado" class="form-label">lado:</label>
                <div class="mb-4 input-group">
                    <span class="input-group-text">
                    <i class="bi bi-person-fill text-secondary"></i>
                    </span>
                    <input type="text" name="lado" v-model="eventoEditado.lado" id="lado" class="form-control" required />
                </div>                      
                <label for="area" class="form-label">area:</label>
                <div class="mb-4 input-group">
                    <span class="input-group-text">
                    <i class="bi bi-person-fill text-secondary"></i>
                    </span>
                    <input type="number" name="area" v-model="eventoEditado.area" id="area" class="form-control" required />
                </div>
                <div class="mb-4 text-center">
                    <button type="submit" class="btn btn-secondary">Enviar</button>
                </div>
            </form>
        </div>
        <div class="col">
            <table class="table table-bordered">
                <tr>
                    <th class="px-3">Id</th>
                    <th class="px-3">Nome</th>
                    <th class="px-3">Lado</th>
                    <th class="px-3">Area</th>
                    <th class="px-3">Acoes</th>

                </tr>
                <tbody>
                    <tr v-for="evento of eventos" :style="{ color: evento.area > 50 ? 'red' : 'green' }">
                        <td>{{evento.id}}</td>
                        <td>{{evento.nome}}</td>
                        <td>{{evento.lado}}</td>
                        <td>{{evento.area}}</td>
                        <button type="button" class="btn btn-light" @click="selecionar(evento);">Selecionar</button>
                        <button type="button" class="btn btn-light" @click="editar(evento);">Editar</button>
                        <button type="button" class="btn btn-light" @click="apagar(evento.id);">Apagar</button>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `
}