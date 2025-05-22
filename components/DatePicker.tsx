import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useFormikContext } from 'formik'
import { MaterialIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { Calendar } from 'react-native-calendars'
import colors from '@/config/colors'

interface DateTimeValuesProps {
  label?: string
  name?: string
  type?: string
}

const DatePicker = ({ label, name = '', type = '' }: DateTimeValuesProps): any => {
  const [open, setOpen] = useState(false)
  const formik: any = useFormikContext()

  const handleClick = (): void => {
    setOpen(true)
  }

  const handleChange = (selectedDate: any): void => {
    setOpen(false)
    const formattedDate = format(selectedDate.dateString, 'dd/MM/yyyy')
    formik.setFieldValue(name, formattedDate)
  }

  return (
    <View style={styles.container}>
      {label !== undefined && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity onPress={handleClick} style={styles.inputContainer}>
        <Text style={styles.input}>
          {formik.values[name] !== undefined && formik.values[name] !== null
            ? formik.values[name]
            : 'DD/MM/YYYY'}
        </Text>
        <MaterialIcons name='calendar-today' size={24} style={styles.icon} />
      </TouchableOpacity>
      {open && (

        <View style={styles.modalContent}>
          <Calendar
            onDayPress={(day: any) => handleChange(day)}
            markedDates={{
              [formik.values[name]]: { selected: true, selectedColor: 'blue' }
            }}
          />

        </View>

      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    position: 'relative'
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: '#000'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.gray,
    padding: 10,
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.black
  },
  icon: {
    position: 'absolute',
    right: 10
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 12
  }
})

export default DatePicker
