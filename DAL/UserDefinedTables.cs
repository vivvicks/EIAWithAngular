using EntityFrameworkExtras.EF6;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EIAwithAngular.DAL
{
    [UserDefinedTableType("UDTImp_Form1Dtl")]
    public class UDTImp_Form1Dtl
    {
        [UserDefinedTableTypeColumn(1)]
        public String MAWBNo { get; set; }

        [UserDefinedTableTypeColumn(2)]
        public Int64 CourierCoId { get; set; }

        [UserDefinedTableTypeColumn(3)]
        public Int64 NoOfPackages { get; set; }

        [UserDefinedTableTypeColumn(4)]
        public decimal Weight { get; set; }

        [UserDefinedTableTypeColumn(5)]
        public Int64 ActualNoOfPackages { get; set; }

        [UserDefinedTableTypeColumn(6)]
        public decimal ActualWeight { get; set; }

        [UserDefinedTableTypeColumn(7)]
        public String Coloader { get; set; }

        [UserDefinedTableTypeColumn(8)]
        public String UldNo { get; set; }
    }
}