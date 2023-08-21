

using Domain.Interfaces.IDespesa;
using Entities.Entidades;
using Infra.Repositorio.Generics;

namespace Infra.Repositorio
{
    public class RepositorioDespesa : RepositoryGenerics<Despesa>, InterfaceDespesa
    {
        public Task<IList<Despesa>> ListarDespesasUsuarioNaoPagasMesesAnterior(string emailUsuario)
        {
            throw new NotImplementedException();
        }

        public Task<IList<Despesa>> ListarDespesaUsuario(string emailUsuario)
        {
            throw new NotImplementedException();
        }
    }
}
