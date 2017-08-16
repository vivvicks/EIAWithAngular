using EIAwithAngular.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIAwithAngular.Repository
{
    public interface IVSEC_ROLE_MST
    {
        IEnumerable<VSEC_ROLE_MST> LoadRoles();
        IEnumerable<VSEC_ROLE_MST> SearchRoles(string RoleSName, string DisplayName, string Status);
        void CreatRole(VSEC_ROLE_MST vsec_role_mst);
        VSEC_ROLE_MST GetRoleByID(int ID);
        void UpdateRole(VSEC_ROLE_MST vsec_role_mst);
        IEnumerable<VW_UserDetail> searchMappedRoles(int roleID, string Status, string TermincalCode);
        void AllocateDeallocateMappedRoles(long[] id, int RoleID, string LoginID, string AllocateDeAllocate);
    }
}
