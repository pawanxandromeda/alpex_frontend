import React from 'react'
import { format } from 'date-fns'
import { IoCalendarOutline } from 'react-icons/io5'

const HolidayCalendar = () => {
    const year = 2025
    const sortedHolidays = [...holidays].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    )
    const currentDate = new Date('2025-03-22')

    return (
        <div className="mx-auto max-w-3xl p-6">
            <div className="mb-8 text-center">
                <div className="mb-3 flex justify-center">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl text-indigo-600 ring-4 ring-indigo-50">
                        <IoCalendarOutline />
                    </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Corporate Holiday Calendar
                </h1>
                <p className="mt-2 text-lg font-medium text-gray-500">
                    {year} Calendar Year
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5">
                <table className="w-full border-collapse bg-white">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-white">
                            <th className="p-4 text-left">
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    Date
                                </div>
                            </th>
                            <th className="p-4 text-left">
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    Day
                                </div>
                            </th>
                            <th className="p-4 text-left">
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    Holiday Name
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedHolidays.map((holiday) => {
                            const holidayDate = new Date(holiday.date)
                            const isToday =
                                holidayDate.toDateString() ===
                                currentDate.toDateString()

                            return (
                                <tr
                                    key={holiday.date}
                                    className={`group border-t border-gray-100 transition-colors duration-200 hover:bg-gray-50/80 ${
                                        isToday
                                            ? 'bg-indigo-50/50 hover:bg-indigo-50/70'
                                            : ''
                                    }`}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700 ring-1 ring-gray-200/50 group-hover:bg-white group-hover:shadow-sm">
                                                {format(holidayDate, 'd')}
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {format(
                                                    holidayDate,
                                                    'MMMM yyyy'
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-gray-200/50 group-hover:bg-white group-hover:shadow-sm">
                                            {format(holidayDate, 'EEEE')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="rounded-lg bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700 ring-1 ring-rose-500/10">
                                            {holiday.name}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer with current date and total holidays */}
            <div className="mt-6 flex items-center justify-between rounded-lg bg-gray-50 px-6 py-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">
                        Today:
                    </span>
                    <span className="rounded-md bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-200">
                        {format(currentDate, 'MMMM d, yyyy')}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">
                        Total Holidays:
                    </span>
                    <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-700/10">
                        {holidays.length}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default HolidayCalendar
