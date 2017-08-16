using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EIAwithAngular.Models;

namespace EIAwithAngular.Repository
{
    public interface IProfile
    {
        IEnumerable<VSEC_PROFILE_MST> LoadProfiles();
        IEnumerable<VSEC_PROFILE_MST> SearchRoles(VSEC_PROFILE_MST vsec_profile_mst);
        void CreateProfile(VSEC_PROFILE_MST vsec_profile_mst);
        VSEC_PROFILE_MST GetProfileByID(int ID);
        void UpdateProfile(VSEC_PROFILE_MST vsec_profile_mst);
        void Remove(int[] ProfileID, string LoginID);
    }
}
