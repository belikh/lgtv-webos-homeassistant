---
title: Sensor entity | Home Assistant Developer Docs
id: sensor-entity-home-assistant-developer-docs-2
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:17:16.883410Z'
source: https://developers.home-assistant.io/docs/core/entity/sensor/
source_domain: developers.home-assistant.io
fetched_at: '2026-08-28T02:17:14.376726Z'
fetch_provider: builtin
status: draft
type: note
deprecated: false
summary: Sensor entity | Home Assistant Developer Docs
---

Sensor entity | Home Assistant Developer Docs

Skip to main content

On this page

A sensor is a read-only entity that provides some information. Information has a value and optionally, a unit of measurement. Derive entity platforms from homeassistant.components.sensor.SensorEntity

Properties​

tip

Properties should always only return information from memory and not do I/O (like network requests). Implement update() or async_update() to fetch data.
NameTypeDefaultDescriptiondevice_classSensorDeviceClass | NoneNoneType of sensor.last_resetdatetime.datetime | NoneNoneThe time when an accumulating sensor such as an electricity usage meter, gas meter, water meter etc. was initialized. If the time of initialization is unknown, set it to None. Note that the datetime.datetime returned by the last_reset property will be converted to an ISO 8601-formatted string when the entity's state attributes are updated. When changing last_reset, the state must be a valid number.native_unit_of_measurementstr | NoneNoneThe unit of measurement that the sensor's value is expressed in. If the native_unit_of_measurement is °C or °F, and its device_class is temperature, the sensor's unit_of_measurement will be the preferred temperature unit configured by the user and the sensor's state will be the native_value after an optional unit conversion. If a unit translation is provided, native_unit_of_measurement should not be defined.native_valuestr | int | float | date | datetime | Decimal | NoneRequiredThe value of the sensor in the sensor's native_unit_of_measurement. Using a device_class may restrict the types that can be returned by this property.optionslist[str] | NoneNoneIn case this sensor provides a textual state, this property can be used to provide a list of possible states. Requires the enum device class to be set. Cannot be combined with state_class or native_unit_of_measurement.state_classSensorStateClass | str | NoneNoneType of state. If not None, the sensor is assumed to be numerical and will be displayed as a line-chart in the frontend instead of as discrete values.suggested_display_precisionint | NoneNoneThe number of decimals which should be used in the sensor's state when it's displayed.suggested_unit_of_measurementstr | NoneNoneThe unit of measurement to be used for the sensor's state. For sensors with a unique_id, this will be used as the initial unit of measurement, which users can then override. For sensors without a unique_id, this will be the unit of measurement for the sensor's state. This property is intended to be used by integrations to override automatic unit conversion rules, for example, to make a temperature sensor always display in °C regardless of whether the configured unit system prefers °C or °F, or to make a distance sensor always display in miles even if the configured unit system is metric.

tip

Instead of adding extra_state_attributes for a sensor entity, create an additional sensor entity. Attributes that do not change are only saved in the database once. If extra_state_attributes and the sensor value both frequently change, this can quickly increase the size of the database.

Available device classes​

If specifying a device class, your sensor entity will need to also return the correct unit of measurement.
ConstantSupported unitsDescriptionSensorDeviceClass.ABSOLUTE_HUMIDITYg/m³, mg/m³Absolute humiditySensorDeviceClass.APPARENT_POWERmVA, VA, kVAApparent powerSensorDeviceClass.AQINoneAir Quality IndexSensorDeviceClass.AREAm², cm², km², mm², in², ft², yd², mi², ac, haAreaSensorDeviceClass.ATMOSPHERIC_PRESSUREcbar, bar, hPa, mmHg, inHg, inH₂O, kPa, mbar, Pa, psiAtmospheric pressureSensorDeviceClass.BATTERY%Percentage of battery that is leftSensorDeviceClass.BLOOD_GLUCOSE_CONCENTRATIONmg/dL, mmol/LBlood glucose concentrationSensorDeviceClass.CO2ppmConcentration of carbon dioxide.SensorDeviceClass.COppb, ppm, µg/m³, mg/m³Concentration of carbon monoxide.SensorDeviceClass.CONDUCTIVITYS/cm, mS/cm, µS/cmConductivitySensorDeviceClass.CURRENTA, mA, µACurrentSensorDeviceClass.DATA_RATEbit/s, kbit/s, Mbit/s, Gbit/s, B/s, kB/s, MB/s, GB/s, KiB/s, MiB/s, GiB/sData rateSensorDeviceClass.DATA_SIZEbit, kbit, Mbit, Gbit, B, kB, MB, GB, TB, PB, EB, ZB, YB, KiB, MiB, GiB, TiB, PiB, EiB, ZiB, YiBData sizeSensorDeviceClass.DATEDate. Requires native_value to be a Python datetime.date object, or None.SensorDeviceClass.DISTANCEkm, m, cm, mm, mi, nmi, yd, inGeneric distanceSensorDeviceClass.DURATIONd, h, min, s, ms, µsTime period. Should not update only due to time passing. The device or service needs to give a new data point to update.SensorDeviceClass.ENERGYJ, kJ, MJ, GJ, mWh, Wh, kWh, MWh, GWh, TWh, cal, kcal, Mcal, GcalEnergy, this device class should be used for sensors representing energy consumption, for example an electricity meter. Represents power over time. Not to be confused with power.SensorDeviceClass.ENERGY_DISTANCEkWh/100km, Wh/km, mi/kWh, km/kWhEnergy per distance, this device class should be used to represent energy consumption by distance, for example the amount of electric energy consumed by an electric car.SensorDeviceClass.ENERGY_STORAGEJ, kJ, MJ, GJ, mWh, Wh, kWh, MWh, GWh, TWh, cal, kcal, Mcal, GcalStored energy, this device class should be used for sensors representing stored energy, for example the amount of electric energy currently stored in a battery or the capacity of a battery. Represents power over time. Not to be confused with power.SensorDeviceClass.ENUMThe sensor has a limited set of (non-numeric) states. The options property must be set to a list of possible states when using this device class.SensorDeviceClass.FREQUENCYmHz, Hz, kHz, MHz, GHzFrequencySensorDeviceClass.GASL, m³, ft³, CCF, MCFVolume of gas. Gas consumption measured as energy in kWh instead of a volume should be classified as energy.SensorDeviceClass.HUMIDITY%Relative humiditySensorDeviceClass.ILLUMINANCElxLight levelSensorDeviceClass.IRRADIANCEW/m², BTU/(h⋅ft²)IrradianceSensorDeviceClass.MOISTURE%MoistureSensorDeviceClass.MONETARYISO 4217Monetary value with a currency.SensorDeviceClass.NITROGEN_DIOXIDEppb, ppm, µg/m³Concentration of nitrogen dioxideSensorDeviceClass.NITROGEN_MONOXIDEppb, µg/m³Concentration of nitrogen monoxideSensorDeviceClass.NITROUS_OXIDEµg/m³Concentration of nitrous oxideSensorDeviceClass.OZONEppb, ppm, µg/m³Concentration of ozoneSensorDeviceClass.PHNonePotential hydrogen (pH) of an aqueous solutionSensorDeviceClass.PM1µg/m³Concentration of particulate matter less than 1 micrometerSensorDeviceClass.PM25µg/m³Concentration of particulate matter less than 2.5 micrometersSensorDeviceClass.PM4µg/m³Concentration of particulate matter less than 4 micrometersSensorDeviceClass.PM10µg/m³Concentration of particulate matter less than 10 micrometersSensorDeviceClass.POWERmW, W, kW, MW, GW, TWPower.SensorDeviceClass.POWER_FACTOR%, NonePower FactorSensorDeviceClass.PRECIPITATIONcm, in, mmAccumulated precipitationSensorDeviceClass.PRECIPITATION_INTENSITYin/d, in/h, mm/d, mm/hPrecipitation intensitySensorDeviceClass.PRESSUREcbar, bar, hPa, mmHg, inHg, kPa, mbar, Pa, psi, mPaPressure.SensorDeviceClass.RADONBq/m³, pCi/LRadon concentrationSensorDeviceClass.REACTIVE_ENERGYvarh, kvarhReactive energySensorDeviceClass.REACTIVE_POWERmvar, var, kvarReactive powerSensorDeviceClass.SIGNAL_STRENGTHdB, dBmSignal strengthSensorDeviceClass.SOUND_PRESSUREdB, dBASound pressureSensorDeviceClass.SPEEDft/s, in/d, in/h, in/s, km/h, kn, m/s, mph, mm/d, mm/sGeneric speedSensorDeviceClass.SULPHUR_DIOXIDEppb, µg/m³Concentration of sulphure dioxideSensorDeviceClass.TEMPERATURE°C, °F, KTemperature.SensorDeviceClass.TEMPERATURE_DELTA°C, °F, KThis device class represents a temperature interval (delta), that is, the difference between two temperature values.SensorDeviceClass.TIMESTAMPTimestamp. Requires native_value to return a Python datetime.datetime object, with time zone information, or None.SensorDeviceClass.UPTIMETimestamp. Represents the datetime when the device last booted. Requires native_value to return a Python datetime.datetime object, with time zone information, or None.SensorDeviceClass.VOLATILE_ORGANIC_COMPOUNDSµg/m³, mg/m³Concentration of volatile organic compoundsSensorDeviceClass.VOLATILE_ORGANIC_COMPOUNDS_PARTSppm, ppbRatio of volatile organic compoundsSensorDeviceClass.VOLTAGEV, mV, µV, kV, MVVoltageSensorDeviceClass.VOLUMEL, mL, gal, fl. oz., m³, ft³, CCF, MCFGeneric volume, this device class should be used for sensors representing a consumption, for example the amount of fuel consumed by a vehicle.SensorDeviceClass.VOLUME_FLOW_RATEm³/h, m³/min, m³/s, ft³/min, L/h, L/min, L/s, gal/d, gal/h, gal/min, mL/sVolume flow rate, this device class should be used for sensors representing a flow of some volume, for example the amount of water consumed momentarily.SensorDeviceClass.VOLUME_STORAGEL, mL, gal, fl. oz., m³, ft³, CCF, MCFGeneric stored volume, this device class should be used for sensors representing a stored volume, for example the amount of fuel in a fuel tank.SensorDeviceClass.WATERL, gal, m³, ft³, CCF, MCFWater consumptionSensorDeviceClass.WEIGHTkg, g, mg, µg, oz, lb, stGeneric mass; weight is used instead of mass to fit with every day language.SensorDeviceClass.WIND_DIRECTION°Wind direction, should be set to None if the wind speed is 0 or too low to accurately measure the wind direction.SensorDeviceClass.WIND_SPEEDft/s, km/h, kn, m/s, mphWind speed

Available state classes​

caution

Choose the state class for a sensor with care. In most cases, state class SensorStateClass.MEASUREMENT or state class SensorStateClass.TOTAL without last_reset should be chosen, this is explained further in How to choose state_class and last_reset below.
TypeDescriptionSensorStateClass.MEASUREMENTThe state represents a measurement in present time, not a historical aggregation such as statistics or a prediction of the future. Examples of what should be classified SensorStateClass.MEASUREMENT are: current temperature, humidity or electric power. Examples of what should not be classified as SensorStateClass.MEASUREMENT: Forecasted temperature for tomorrow, yesterday's energy consumption or anything else that doesn't include the current measurement. For supported sensors, statistics of hourly min, max and average sensor readings is updated every 5 minutes.SensorStateClass.MEASUREMENT_ANGLESimilar to the above SensorStateClass.MEASUREMENT, the state represents a measurement in present time for angles measured in degrees (°). An example of what should be classified SensorStateClass.MEASUREMENT_ANGLE is current wind directionSensorStateClass.TOTALThe state represents a total amount that can both increase and decrease, for example, a net energy meter. Statistics of the accumulated growth or decline of the sensor's value since it was first added is updated every 5 minutes. This state class should not be used for sensors where the absolute value is interesting instead of the accumulated growth or decline, for example remaining battery capacity or CPU load; in such cases state class SensorStateClass.MEASUREMENT should be used instead.SensorStateClass.TOTAL_INCREASINGSimilar to SensorStateClass.TOTAL, with the restriction that the state represents a monotonically increasing positive total which periodically restarts counting from 0, for example, a daily amount of consumed gas, weekly water consumption or lifetime energy consumption. Statistics of the accumulated growth of the sensor's value since it was first added is updated every 5 minutes. A decreasing value is interpreted as the start of a new meter cycle or the replacement of the meter.

Entity options​

Sensors can be configured by the user, this is done by storing sensor entity options in the sensor's entity registry entry.
OptionDescriptionunit_of_measurementThe sensor's unit of measurement can be overridden for sensors with device class SensorDeviceClass.PRESSURE or SensorDeviceClass.TEMPERATURE.

Restoring sensor states​

Sensors which restore the state after restart or reload should not extend RestoreEntity because that does not store the native_value, but instead the state which may have been modified by the sensor base entity. Sensors which restore the state should extend RestoreSensor and call await self.async_get_last_sensor_data from async_added_to_hass to get access to the stored native_value and native_unit_of_measurement.

Long-term Statistics​

Home Assistant has support for storing sensors as long-term statistics if the entity has
the right properties. To opt-in for statistics, the sensor must have
state_class set to one of the valid state classes: SensorStateClass.MEASUREMENT, SensorStateClass.TOTAL or
SensorStateClass.TOTAL_INCREASING.
For certain device classes, the unit of the statistics is normalized to for example make
it possible to plot several sensors in a single graph.

Entities not representing a total amount​

Home Assistant tracks the min, max and mean value during the statistics period. The
state_class property must be set to SensorStateClass.MEASUREMENT, and the device_class must not be
either of SensorDeviceClass.DATE, SensorDeviceClass.ENUM, SensorDeviceClass.ENERGY, SensorDeviceClass.GAS, SensorDeviceClass.MONETARY,
SensorDeviceClass.TIMESTAMP, SensorDeviceClass.VOLUME or SensorDeviceClass.WATER.

Entities representing a total amount​

Entities tracking a total amount have a value that may optionally reset periodically,
like this month's energy consumption, today's energy production, the weight of pellets used to heat the house over the last week or the yearly growth of
a stock portfolio. The sensor's value when the first statistics is compiled is used as the initial zero-point.

How to choose state_class and last_reset​

It's recommended to use state class SensorStateClass.TOTAL without last_reset whenever possible, state class SensorStateClass.TOTAL_INCREASING or SensorStateClass.TOTAL with last_reset should only be used when state class SensorStateClass.TOTAL without last_reset does not work for the sensor.

Examples:

The sensor's value never resets, for example, a lifetime total energy consumption or production: state_class SensorStateClass.TOTAL, last_reset not set or set to None

The sensor's value may reset to 0, and its value can only increase: state class SensorStateClass.TOTAL_INCREASING. Examples: energy consumption aligned with a billing cycle, for example, monthly, an energy meter resetting to 0 every time it's disconnected

The sensor's value may reset to 0, and its value can both increase and decrease: state class SensorStateClass.TOTAL, last_reset updated when the value resets. Examples: net energy consumption aligned with a billing cycle, for example, monthly.

The sensor's state is reset with every state update, for example a sensor updating every minute with the energy consumption during the past minute: state class SensorStateClass.TOTAL, last_reset updated every state change.

State class SensorStateClass.TOTAL​

For sensors with state class SensorStateClass.TOTAL, the last_reset attribute can
optionally be set to gain manual control of meter cycles.
The sensor's state when it's first added to Home Assistant is used as an initial
zero-point. When last_reset changes, the zero-point will be set to 0.
If last_reset is not set, the sensor's value when it was first added is used as the
zero-point when calculating sum statistics.

To put it in another way: the logic when updating the statistics is to update
the sum column with the difference between the current state and the previous state
unless last_reset has been changed, in which case don't add anything.

Example of state class SensorStateClass.TOTAL without last_reset:
tstatesumsum_increasesum_decrease2021-08-01T13:00:0010000002021-08-01T14:00:001010101002021-08-01T15:00:000-10001010102021-08-01T16:00:005-995151010

Example of state class SensorStateClass.TOTAL with last_reset:
tstatelast_resetsumsum_increasesum_decrease2021-08-01T13:00:0010002021-08-01T13:00:000002021-08-01T14:00:0010102021-08-01T13:00:00101002021-08-01T15:00:0010052021-08-01T13:00:0051052021-08-01T16:00:0002021-09-01T16:00:0051052021-08-01T17:00:0052021-09-01T16:00:0010155

Example of state class SensorStateClass.TOTAL where the initial state at the beginning
of the new meter cycle is not 0, but 0 is used as zero-point:
tstatelast_resetsumsum_increasesum_decrease2021-08-01T13:00:0010002021-08-01T13:00:000002021-08-01T14:00:0010102021-08-01T13:00:00101002021-08-01T15:00:0010052021-08-01T13:00:0051052021-08-01T16:00:0052021-09-01T16:00:00101552021-08-01T17:00:00102021-09-01T16:00:0015205

State class SensorStateClass.TOTAL_INCREASING​

For sensors with state_class SensorStateClass.TOTAL_INCREASING, a decreasing value is
interpreted as the start of a new meter cycle or the replacement of the meter. It is
important that the integration ensures that the value cannot erroneously decrease in
the case of calculating a value from a sensor with measurement noise present. There is
some tolerance, a decrease between state changes of < 10% will not trigger a new meter
cycle. This state class is useful for gas meters, electricity meters, water meters etc.
The value when the sensor reading decreases will not be used as zero-point when calculating
sum statistics, instead the zero-point will be set to 0.

To put it in another way: the logic when updating the statistics is to update
the sum column with the difference between the current state and the previous state
unless the difference is negative, in which case don't add anything.

Example of state class SensorStateClass.TOTAL_INCREASING:
tstatesum2021-08-01T13:00:00100002021-08-01T14:00:001010102021-08-01T15:00:000102021-08-01T16:00:00515

Example of state class SensorStateClass.TOTAL_INCREASING where the sensor does not reset to 0:
tstatesum2021-08-01T13:00:00100002021-08-01T14:00:001010102021-08-01T15:00:005152021-08-01T16:00:001020

Handling migration from unsupported to supported units of measurement​

Integrations may have sensors which have their own custom units of measurement, that is, they don't use Home Assistant constants to set the units.

When migrating such a sensor to a unit supported by Home Assistant's unit system, the old custom unit must match the value of the Home Assistant constant exactly or Home Assistant will treat this as a unit change.

For example, the integration may have set the unit of an energy sensor to KWh which differs from the value of UnitOfEnergy.KILO_WATT_HOUR (kWh).

During compilation of long-term statistics this unit change will be detected. Without knowledge of how old and new unit relate to each other,
collection of statistics is suppressed and a warning about unstable units is generated.

To facilitate these migration cases, integrations can provide a custom unit mapping to declare any non-supported unit
equivalent to a supported unit. This is done by creating a recorder platform recorder.py in your integration's directory
and implementing the function async_custom_equivalent_units to return a mapping for any relevant entity_id to a dictionary of equivalent units.
This mapping will be collected during statistics compilation and enables integrations a smooth transition into Home Assistant's unit system.

Example implementation:

@callback

def async_custom_equivalent_units(hass: HomeAssistant) -> dict[str, dict[str | None, str]]:

"""Return custom equivalent units per entity id."""

return {

"sensor.example_sensor_1": {

"b/s": UnitOfDataRate.BYTES_PER_SECOND, # B/s

},

"sensor.example_sensor_2": {

"KWh": UnitOfEnergy.KILO_WATT_HOUR, # kWh

},

}

Properties
Available device classes
Available state classes
Entity options
Restoring sensor states
Long-term Statistics
Entities not representing a total amount
Entities representing a total amount
Handling migration from unsupported to supported units of measurement

## Related

- [[entity-home-assistant-developer-docs]]
