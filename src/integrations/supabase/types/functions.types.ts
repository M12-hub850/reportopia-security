export interface DatabaseFunctions {
  get_weekly_visits: {
    Args: { user_id: string }
    Returns: Array<{ status: string; count: number }>
  }
  get_monthly_visits: {
    Args: { user_id: string }
    Returns: Array<{ status: string; count: number }>
  }
  get_report_counts: {
    Args: {
      p_user_id: string
      p_start_date: string
      p_end_date: string
    }
    Returns: Array<{ report_type: string; count: number }>
  }
}