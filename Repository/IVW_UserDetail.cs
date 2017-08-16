using EIAwithAngular.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Web.Helpers;

namespace EIAwithAngular.Repository
{
    public interface IVW_UserDetail
    {
        IEnumerable<M_Airline_MST> AirlineList();
        IEnumerable<VW_UserDetail> LoadUsers(String TermicalCode);
        IEnumerable<VW_UserDetail> SearchUsers(String LoginID,String UserName, String ActiveStaus, String LockStatus);
        void CreatUser(VW_UserDetail vw_userdetail);
        void UpdateUser(VW_UserDetail vw_userdetail);
        VW_UserDetail GetUserByID(int ID);
        void ActivateDeactivate(long[] id, string LoginID, string ActivateDeactivate);
        void Unlock(long[] id,string LoginID);
    }
}
