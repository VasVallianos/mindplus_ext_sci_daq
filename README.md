# SCI DAQ — Mind+ Extension
## DFRobot DFR0999 RP2040 Science Data Acquisition Module

---

## Τι είναι το SCI DAQ;

Το SCI DAQ (DFR0999) είναι ένα module που:
- **Αναγνωρίζει αυτόματα** I²C αισθητήρες στο Port2 και Port3
- **Εμφανίζει δεδομένα** στην ενσωματωμένη οθόνη του
- **Καταγράφει** δεδομένα σε κάρτα SD (CSV)
- **Εκθέτει** τα δεδομένα στο Arduino μέσω I²C (διεύθυνση 0x21)

---

### Θύρες αισθητήρων

```
Port1  (3-pin Gravity) → Αναλογικοί / Ψηφιακοί αισθητήρες
                          Χειροκίνητη επιλογή SKU από μενού
Port2  (4-pin Gravity) → I²C αισθητήρες — αυτόματη αναγνώριση
Port3  (4-pin Gravity) → I²C αισθητήρες — αυτόματη αναγνώριση
```

---

### Enums — Πόρτες

```typescript
enum PORTS {
    eALL,    // Όλες οι πόρτες — βρίσκει αυτόματα τον αισθητήρα
    ePort1,  // Αναλογική/ψηφιακή πόρτα
    ePort2,  // I²C πόρτα (αριστερά)
    ePort3   // I²C πόρτα (δεξιά)
}

```

---

## Blocks

### Αρχικοποίηση

```
sciDaqInit
```

Τι κάνει στο setup():
1. Αρχικοποιεί I²C στο `0x21`
2. Ορίζει Port1 ως `"Analog"`
3. Ορίζει Port2 και Port3 ως `"NULL"` (αυτόματη αναγνώριση)
4. Εκτυπώνει στο Serial Monitor την κατάσταση κάθε port (SKU + τύπος)

---

### Γενικό Block — Οποιοσδήποτε αισθητήρας

| Block | Παράμετρος | Επιστρέφει |
|---|---|---|
| `getSciValue(NAME)` | String (π.χ. `"AQI"`) | String |

**Generated C++:**
```cpp
sci.getValue(sci.eALL, "AQI")   // επιστρέφει String
```

> Χρήσιμο για αισθητήρες χωρίς dedicated block. Μετατροπή: `.toFloat()` ή `.toInt()` στον κώδικα.

---

### Πλήρης Λίστα getValue() Strings

| String | Αισθητήρας | Μονάδα | Port |
|---|---|---|---|
| `"Temp_Air"` | SEN0334 | °C | Port2/3 |
| `"Humi_Air"` | SEN0334 | % RH | Port2/3 |
| `"Light"` | SEN0228 | lux | Port2/3 |
| `"AQI"` | SEN0514 | 1–5 | Port2/3 |
| `"TVOC"` | SEN0514 | ppb | Port2/3 |
| `"ECO2"` | SEN0514 | ppm | Port2/3 |
| `"Soil_Moi"` | SEN0114 | — | Port1 (χειροκίνητο) |

> ⚠️ Τα strings είναι **case-sensitive**.

---

## eALL vs ePort — Πότε χρησιμοποιείς τι

| Περίπτωση | Χρήση |
|---|---|
| Ένας αισθητήρας ανά τύπο μέτρησης | `eALL` — βρίσκει αυτόματα |
| Δύο αισθητήρες με ίδιο string | `ePort2` / `ePort3` — προσδιορίζεις ακριβώς |
| SEN0114 στο Port1 (analog) | `ePort1` — αποκλειστικά |

---

## Συχνά Προβλήματα

| Πρόβλημα | Αιτία | Λύση |
|---|---|---|
| `SCI DAQ init failed` | Λάθος καλώδια ή διεύθυνση | Έλεγξε A4/A5 και διεύθυνση 0x21 |
| `getValue()` επιστρέφει `""` | Λάθος string ή αισθητήρας δεν αναγνωρίστηκε | Έλεγξε Serial Monitor για SKU |
| Λάθος τιμή θερμοκρασίας | `eALL` με δύο αισθητήρες θερμοκρασίας | Χρησιμοποίησε `ePort2` / `ePort3` |
| ENS160 δίνει 0 | Δεν έχει περάσει προθέρμανση 3 λεπτών | Περίμενε 3 λεπτά μετά το power-on |
| Port1 δεν διαβάζει αισθητήρα | I²C αισθητήρας σε Port1 | Port1 = analog/digital μόνο |

---

## Χρήσιμοι Σύνδεσμοι

- [DFRobot Wiki DFR0999](https://wiki.dfrobot.com/dfr0999)
- [GitHub DFRobot_RP2040_SCI](https://github.com/DFRobot/DFRobot_RP2040_SCI)
- [Firmware downloads](https://github.com/DFRobot/DFRobot_RP2040_SCI/tree/master/resources/firmware)

---

*Τεκμηρίωση βασισμένη στο επίσημο DFRobot Wiki, GitHub και τον κώδικα sciDAQ/main.ts.*
*Τελευταία ενημέρωση: Μάρτιος 2026*
