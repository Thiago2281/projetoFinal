export default {
    props: {
        usuarios: Array
    },
    setup(props, {emit}) {
        const usuarios = Vue.ref(props.usuarios)
        function selecionar(usuario) {
            this.$router.push('/detalhes/' + usuario.id);
        }
        return {
            usuarios,
            selecionar
        }
    },
    template: `
    <table class="table table-hover" style="margin: 0 auto; width: 40%;">
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
    `
}