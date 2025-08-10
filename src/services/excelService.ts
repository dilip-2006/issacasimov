import * as XLSX from 'xlsx';
import { SystemData, BorrowRequest, Component, User, LoginSession } from '../types';

export class ExcelService {
  private static instance: ExcelService;

  static getInstance(): ExcelService {
    if (!ExcelService.instance) {
      ExcelService.instance = new ExcelService();
    }
    return ExcelService.instance;
  }

  exportToExcel(data: SystemData): void {
    const workbook = XLSX.utils.book_new();
    
    // Create simple sheets
    this.addBorrowingRecordsSheet(workbook, data.requests, data.components);
    this.addInventoryStatusSheet(workbook, data.components);
    this.addCurrentlyBorrowedSheet(workbook, data.requests, data.components);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Isaac-Asimov-Lab-Report-${timestamp}.xlsx`;

    // Write and download
    XLSX.writeFile(workbook, filename);
  }

  private addBorrowingRecordsSheet(workbook: XLSX.WorkBook, requests: BorrowRequest[], components: Component[]): void {
    const headers = [
      'Record ID',
      'Student Name',
      'Roll Number',
      'Mobile Number',
      'Component Name',
      'Quantity',
      'Borrowed Date',
      'Due Date',
      'Status',
      'Days Remaining',
      'Approved By',
      'Return Date'
    ];

    const rows = requests.map(request => {
      const dueDate = new Date(request.dueDate);
      const now = new Date();
      const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return [
        request.id,
        request.studentName,
        request.rollNo,
        request.mobile,
        request.componentName,
        request.quantity,
        new Date(request.requestDate).toLocaleDateString(),
        dueDate.toLocaleDateString(),
        request.status.toUpperCase(),
        request.status === 'approved' ? daysRemaining : 'N/A',
        request.approvedBy || 'N/A',
        request.returnedAt ? new Date(request.returnedAt).toLocaleDateString() : 'Not Returned'
      ];
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    
    this.styleSheet(worksheet, 'FF9800');

    worksheet['!cols'] = [
      { width: 15 }, { width: 20 }, { width: 15 }, { width: 15 },
      { width: 25 }, { width: 10 }, { width: 15 }, { width: 15 },
      { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Borrowing Records');
  }

  private addUserActivityReportSheet(workbook: XLSX.WorkBook, users: User[], sessions: LoginSession[]): void {
    const headers = [
      'User ID',
      'Full Name',
      'Email Address',
      'User Role',
      'Registration Date',
      'Last Login Date',
      'Total Login Count',
      'Account Status',
      'Activity Level',
      'Days Since Last Login',
      'Account Age (Days)',
      'Engagement Score',
      'Total Session Time (Hours)',
      'Average Session Duration',
      'Peak Activity Day',
      'Preferred Login Time',
      'Device Usage',
      'Components Borrowed',
      'Active Requests',
      'Completed Returns',
      'Success Rate (%)'
    ];

    const rows = users.map(user => {
      const userSessions = sessions.filter(s => s.userId === user.id);
      const registrationDate = new Date(user.registeredAt);
      const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt) : null;
      const now = new Date();
      
      const daysSinceLastLogin = lastLogin 
        ? Math.ceil((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24))
        : 'Never logged in';
      
      const accountAge = Math.ceil((now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const activityLevel = user.loginCount && user.loginCount > 10 ? '🔥 High' :
                           user.loginCount && user.loginCount > 3 ? '📈 Medium' :
                           user.loginCount && user.loginCount > 0 ? '📊 Low' : '💤 Inactive';

      const engagementScore = user.loginCount && accountAge > 0 
        ? ((user.loginCount / accountAge) * 100).toFixed(2)
        : '0.00';

      const totalSessionTime = userSessions.reduce((total, session) => {
        const duration = session.sessionDuration || 0;
        return total + (duration / (1000 * 60 * 60)); // Convert to hours
      }, 0).toFixed(2);

      const avgSessionDuration = userSessions.length > 0
        ? (parseFloat(totalSessionTime) / userSessions.length).toFixed(2) + ' hours'
        : '0 hours';

      const peakDay = this.getMostActiveDay(userSessions);
      const preferredTime = this.getPreferredLoginTime(userSessions);
      const deviceUsage = this.getDeviceUsage(userSessions);

      return [
        user.id,
        user.name,
        user.email,
        user.role.toUpperCase(),
        registrationDate.toLocaleDateString(),
        lastLogin ? lastLogin.toLocaleDateString() : 'Never',
        user.loginCount || 0,
        user.isActive ? '🟢 ACTIVE' : '🔴 INACTIVE',
        activityLevel,
        daysSinceLastLogin,
        accountAge,
        engagementScore,
        totalSessionTime,
        avgSessionDuration,
        peakDay,
        preferredTime,
        deviceUsage,
        'N/A', // Components borrowed (would need request data)
        'N/A', // Active requests
        'N/A', // Completed returns
        'N/A'  // Success rate
      ];
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    
    this.styleUserSheet(worksheet);

    worksheet['!cols'] = [
      { width: 15 }, { width: 25 }, { width: 30 }, { width: 12 },
      { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 },
      { width: 15 }, { width: 18 }, { width: 15 }, { width: 15 },
      { width: 20 }, { width: 20 }, { width: 15 }, { width: 18 },
      { width: 15 }, { width: 18 }, { width: 15 }, { width: 18 }, { width: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Activity Report');
  }

  private addInventoryStatusSheet(workbook: XLSX.WorkBook, components: Component[]): void {
    const headers = [
      'Component Name',
      'Category',
      'Total Stock',
      'Available Stock',
      'Currently Borrowed',
      'Stock Status',
      'Description'
    ];

    const rows = components.map(component => {
      const stockPercentage = (component.availableQuantity / component.totalQuantity) * 100;
      const stockStatus = component.availableQuantity === 0 ? '🔴 OUT OF STOCK' :
                         stockPercentage < 20 ? '🟡 LOW STOCK' :
                         stockPercentage < 50 ? '🟠 MEDIUM STOCK' : '🟢 GOOD STOCK';

      const borrowed = component.totalQuantity - component.availableQuantity;

      return [
        component.name,
        component.category,
        component.totalQuantity,
        component.availableQuantity,
        borrowed,
        stockStatus,
        component.description || 'Standard lab component'
      ];
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    
    this.styleSheet(worksheet, '795548');

    worksheet['!cols'] = [
      { width: 25 }, { width: 18 }, { width: 15 }, { width: 15 },
      { width: 18 }, { width: 18 }, { width: 30 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
  }

  // Helper methods for styling
  private styleSheet(worksheet: XLSX.WorkSheet, color: string): void {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    // Header row styling
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: color } },
          alignment: { horizontal: "center" }
        };
      }
    }
  }

  generatePreviewData(data: SystemData): any {
    return {
      summary: {
        totalBorrowingRecords: data.requests.length,
        currentlyBorrowed: data.requests.filter(r => r.status === 'approved').length,
        totalReturned: data.requests.filter(r => r.status === 'returned').length,
        totalComponents: data.components.length
      },
      borrowingRecords: data.requests.slice(0, 10),
      inventory: data.components
    };
  }
}

export const excelService = ExcelService.getInstance();