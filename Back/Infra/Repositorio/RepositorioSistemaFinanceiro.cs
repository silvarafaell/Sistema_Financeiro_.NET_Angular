

using Domain.Interfaces.ISistemaFinanceiro;
using Entities.Entidades;
using Infra.Repositorio.Generics;

namespace Infra.Repositorio
{
    public class RepositorioSistemaFinanceiro : RepositoryGenerics<SistemaFinanceiro>, InterfaceSistemaFinanceiro
    {
        public Task<IList<SistemaFinanceiro>> ListaSistemasUsuario(string emailUsuario)
        {
            throw new NotImplementedException();
        }
    }
}
