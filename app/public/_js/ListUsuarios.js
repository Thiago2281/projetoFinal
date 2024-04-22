export default {
    props: {
        usuarios: Array,
        eventos: Array
    },
    setup(props, {emit}) {
        const usuarios = Vue.ref(props.usuarios)
        const eventos = Vue.ref(props.eventos)

        function selecionar(usuario) {
            this.$router.push('/detalhes/' + usuario.id);
        }
        function selecionarEvento(evento) {
            this.$router.push('/detalheseventos/' + evento.id);
        }
        return {
            usuarios,
            eventos,
            selecionar,
            selecionarEvento
        }
    },
    template: `
    <div class="row">
        <div class="col pt-2">
            <table class="table table-hover" style="margin: 0 auto; width: 90%;">
                <thead class="table-dark" >
                    <tr >
                        <th> Lista de usuarios cadastrados</th> 
                        <th></th>           
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="usuario of usuarios">
                    <td>{{usuario.nome}} </td>
                    <td><button class="btn btn-outline-secondary p-1" @click="selecionar(usuario);">Selecionar</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col pt-2">
            <table class="table table-hover" style="margin: 0 auto; width: 90%;">
                <thead class="table-dark" >
                    <tr >
                        <th> Lista de eventos cadastrados</th> 
                        <th></th>           
                    </tr>
                </thead>
            <tbody>
                <tr v-for="evento of eventos">
                <td>{{evento.nome}} </td>
                <td><button class="btn btn-outline-secondary p-1" @click="selecionarEvento(evento);">Selecionar</button></td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
    `
}