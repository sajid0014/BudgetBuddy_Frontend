import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import GetBudget from '../api/Budget/GetBudget';

const { height } = Dimensions.get('window');

const BudgetModal = ({ visible, onClose, onApply }) => {
    const [Budget, setBudget] = useState(0);
    const [Food, setFood] = useState(0);
    const [Entertainment, setEntertainment] = useState(0);
    const [TourTravels, setTourTravels] = useState(0);
    const [Fashion, setFashion] = useState(0);
    const [Academic, setAcademic] = useState(0);

    useEffect(() => {
        const getBudget = async () => {
            const res1 = await GetBudget();
            const data = res1[0];
            setAcademic(data.academics);
            setEntertainment(data.entertainment);
            setFashion(data.fashion);
            setFood(data.food);
            setTourTravels(data["tour/travel"]);
            setBudget(data.Budget);
        }
        getBudget();
    }, [])

    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
                <View style={styles.modal}>
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.header}>
                            <Text style={styles.title}>Spending Filter</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Text style={styles.close}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Total Budget</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={String(Budget)}
                                onChangeText={text => setBudget(Number(text))}
                                placeholder="₹100"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Food</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={String(Food)}
                                onChangeText={text => setFood(Number(text))}
                                placeholder="₹100"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Entertainment</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={String(Entertainment)}
                                onChangeText={text => setEntertainment(Number(text))}
                                placeholder="₹100"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tour and Travels</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={String(TourTravels)}
                                onChangeText={text => setTourTravels(Number(text))}
                                placeholder="₹100"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Fashion</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={String(Fashion)}
                                onChangeText={text => setFashion(Number(text))}
                                placeholder="₹100"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Academics</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={String(Academic)}
                                onChangeText={text => setAcademic(Number(text))}
                                placeholder="₹100"
                            />
                        </View>

                        <TouchableOpacity style={styles.applyButton} onPress={() => onApply({ Budget, Food, Entertainment, TourTravels, Fashion, Academic })}>
                            <Text style={styles.applyText}>Apply</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default BudgetModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // reduced opacity
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    close: {
        fontSize: 22,
        color: '#888',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 6,
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    applyButton: {
        backgroundColor: '#333',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    applyText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
