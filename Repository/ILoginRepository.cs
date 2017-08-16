using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EIAwithAngular.Models;

namespace EIAwithAngular.Repository
{
    interface ILoginRepository
    {
        string GetPassword(string loginid, string WebSessionId, string IpAddress, string Mode);
        List<proc_VSECVerifyUser_Result> ValidateUser(string loginid, string password, string WebSessionId, string IpAddress, int Culture);
    }
}
