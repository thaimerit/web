export function getPeriod(period) {
    let periods = {
        'morning': 'ช่วงเช้า',
        'evening': 'ช่วงบ่าย',
    }

    return periods[period]
}